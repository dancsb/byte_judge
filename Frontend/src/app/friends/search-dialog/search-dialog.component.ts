import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user.service';
import { Friend } from '../../friend';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface SearchDialogData {
  alreadyOutgoingRequested: Friend[];
  alreadyIncomingRequested: Friend[];
  friendLists: Friend[];
}

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    MatCardModule, 
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    MatButton,
    MatIconButton,
    CommonModule,
    MatInput,
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})
export class SearchDialogComponent {
  userService: UserService = inject(UserService);
  searchQuery: string = '';
  searchResults: Friend[] = [];

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SearchDialogData,
    private toastr: ToastrService,
    private router: Router
  ) {}

  async onSearch(query: string): Promise<void> {
    if (query === '') {
      this.searchResults = [];
      return;
    }
    let { isSuccess: isSearch, data: searchResults } = await this.userService.searchUsers(query);
    
    if (isSearch) {
      searchResults = searchResults.filter((user) => {
        return !this.data.alreadyOutgoingRequested.some((outgoingUser) => outgoingUser.id === user.id);
      });
      searchResults = searchResults.filter((user) => {
        return !this.data.alreadyIncomingRequested.some((incomingUser) => incomingUser.id === user.id);
      });
      searchResults = searchResults.filter((user) => {
        return !this.data.friendLists.some((friend) => friend.id === user.id);
      });
      this.searchResults = searchResults;
    }
  }

  onXButton(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  async onAdd(id: string): Promise<void> {
    let isSuccess = await this.userService.sendFriendRequest(id);
    if (isSuccess) {
      this.toastr.success('Friend request sent');
      const userIndex = this.searchResults.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        // Remove the user from searchResults
        const [user] = this.searchResults.splice(userIndex, 1);
        // Add the user to alreadyOutgoingRequested
        this.data.alreadyOutgoingRequested.push(user);
      }
    }
  }

  onClose(): void {
    this.router.navigate(["/landing"]);
    this.dialogRef.close();
  }
}