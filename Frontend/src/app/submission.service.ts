import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}

  submitSolution(
    exerciseId: string,
    sourceCode: string,
    language: string
  ): Observable<{ submissionId: string; message: string }> {
    const payload = { exerciseId, sourceCode, language };
    return new Observable((observer) => {
      this.http
        .post<{ submissionId: string; message: string }>(
          `${environment.apiUrl}/submission`,
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
            observe: 'response',
            withCredentials: true,
          }
        )
        .subscribe({
          next: (response) => {
            observer.next(response.body!);
            observer.complete();
          },
          error: (error) => {
            console.error('Submission failed:', error);
            observer.error(error);
          },
        });
    });
  }

  async getSubmissionsByExercise(exerciseId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any[]>(`${environment.apiUrl}/submissions/${exerciseId}`, {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          withCredentials: true,
        })
        .subscribe({
          next: (response) => {
            resolve(response.body || []);
          },
          error: (error) => {
            console.error('Failed to get submissions by exercise:', error);
            reject([]);
          },
        });
    });
  }

  async getSubmissionById(submissionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(`${environment.apiUrl}/submission/${submissionId}`, {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          withCredentials: true,
        })
        .subscribe({
          next: (response) => {
            resolve(response.body);
          },
          error: (error) => {
            console.error('Failed to get submission by ID:', error);
            reject(null);
          },
        });
    });
  }
}
