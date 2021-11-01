import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = `${environment.apiUrl}/task`;

  constructor(private http: HttpClient) { }

  public getAllRows(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`)
  }

  public createTask(task: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, task);
  }

  public createSubtask(id: string | number, task: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-subtask/${id}`, task);
  }

  public updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, task);
  }

  public deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
