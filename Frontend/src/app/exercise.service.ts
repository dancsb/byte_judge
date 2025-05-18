import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {

  constructor(private http: HttpClient) {}

  async getExercises(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<{exercises: []}>(`${environment.apiUrl}/exercise`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true,
      }).subscribe({
        next: (response) => {
          resolve(response.body?.exercises || []);
        },
        error: (error) => {
        console.error('Failed to get exercises:', error);
          reject([]);
        },
      });
    });
  }

  async getExerciseById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/exercise/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true,
      }).subscribe({
        next: (response) => {
          resolve(response.body);
        },
        error: (error) => {
          console.error('Failed to get exercise by ID:', error);
          reject(null);
        },
      });
    });
  }
}
