import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}

  submitSolution(exerciseId: string, sourceCode: string): Observable<{ submissionId: string; message: string }> {
    const payload = { exerciseId, sourceCode };
    return new Observable((observer) => {
      this.http.post<{ submissionId: string; message: string }>(
        `${environment.apiUrl}/submission`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          withCredentials: true,
        }
      ).subscribe({
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
}
