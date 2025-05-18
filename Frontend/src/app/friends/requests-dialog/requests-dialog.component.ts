import { Component, Inject, inject } from '@angular/core';
import { UserService } from '../../user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface RequestsDialogData {
  users: any[];
}

@Component({
  selector: 'app-requests-dialog',
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
  ],
  templateUrl: './requests-dialog.component.html',
  styleUrl: './requests-dialog.component.scss'
})
export class RequestsDialogComponent {
  userService: UserService = inject(UserService);

  constructor(
    public dialogRef: MatDialogRef<RequestsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestsDialogData,
    private toastr: ToastrService,
    private router: Router
  ) {}

  async onAccept(id: string): Promise<void> {
    await this.userService.acceptFriendRequest(id).then((res) => {
      if (res) {
        this.data.users = this.data.users.filter((user) => user.id !== id);
        
        this.toastr.success('Friend request accepted');
      } else {
        this.toastr.error('Error accepting friend request');
      }
    });
  }

  async onReject(id: string): Promise<void> {
    await this.userService.rejectFriendRequest(id).then((res) => {
      if (res) {
        this.data.users = this.data.users.filter((user) => user.id !== id);
        this.toastr.success('Friend request rejected');
      } else {
        this.toastr.error('Error rejecting friend request');
      }
    });
  }

  onClose(): void {
    this.router.navigate(["/landing"]);
    this.dialogRef.close();
  }
}
