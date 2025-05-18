import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatIconButton } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent, SearchDialogData } from './search-dialog/search-dialog.component';
import { RequestsDialogComponent } from './requests-dialog/requests-dialog.component';
import { Friend } from '../friend';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatListModule,
    NgFor,
    MatIconButton,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent implements OnInit {
  userService: UserService = inject(UserService);
  private userSubscription!: Subscription;
  friends: Friend[] = [];
  friendRequestsNumber: number = 0;
  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.userService.user.subscribe((user) => {
      this.friends = user.friendNameList;
      this.friendRequestsNumber = user.friendRequestsNumber;
    });
  }
  
  onRemoveFriend(id: string) {
    this.userService.removeFriend(id);
  }

  async onAddFriend() {
    let { isSuccess, data: reqUsers } = await this.userService.getIncomingFriendRequests();
    let { isSuccess: isSuccess2, data: sentUsers } = await this.userService.getOutgoingFriendRequests();
    if (isSuccess && isSuccess2) {
      const dialogRef = this.dialog.open(SearchDialogComponent, {
        width: '400px',
        height: '600px',
        data: { 
          alreadyOutgoingRequested: sentUsers,
          alreadyIncomingRequested: reqUsers,
          friendLists: this.friends
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(["/landing"]);
      });
    }
  }

  async onListRequests() {
    let { isSuccess, data: reqUsers } = await this.userService.getIncomingFriendRequests();
    if (isSuccess) {
      const dialogRef = this.dialog.open(RequestsDialogComponent, {
        width: '400px',
        height: '600px',
        data: { users: reqUsers },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(["/landing"]);
      });
    }
  }
}
