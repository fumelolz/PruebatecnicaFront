import { Component } from '@angular/core';
import { User } from '../../../../core/models/users/User.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-list-zones',
  templateUrl: './list-zones.component.html',
  styleUrl: './list-zones.component.scss',
})
export class ListZonesComponent {
  displayedColumns: string[] = ['Nombre', 'Email', 'Acciones'];
  users: User[] = [];
  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (response) => {
        this.users = response.data.items;
      },
    });
  }
}
