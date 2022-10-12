import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from './posts.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './module/login/login.component';
import { ProfileComponent } from './module/profile/profile.component';
import { DashboardComponent } from './module/dashboard/dashboard.component';
import { ExamComponent } from './module/exam/exam.component';
import { ResultComponent } from './module/result/result.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ChartsModule, ThemeService  } from 'ng2-charts';
import { MaterialComponent } from './module/material/material.component';
import { WarningComponent } from './module/warning/warning.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { UsersComponent } from './module/users/users.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminDashboardComponent } from './module/admin-dashboard/admin-dashboard.component';
import { QuestionsComponent } from './module/questions/questions.component';
import { QuestionComponent } from './module/question/question.component';
import { ReportComponent } from './module/report/report.component';
import { ExamSelectionComponent } from './module/exam-selection/exam-selection.component';
import { HomeComponent } from './module/home/home.component';
import { AboutComponent } from './module/about/about.component';
import { EOComponent } from './module/eo/eo.component';
import { UpdatepasswordComponent } from './module/updatepassword/updatepassword.component'; // this is needed!
@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    LoginComponent,
    ProfileComponent,
    DashboardComponent,
    ExamComponent,
    ResultComponent,
    MaterialComponent,
    WarningComponent,
    UsersComponent,
    AdminDashboardComponent,
    QuestionsComponent,
    QuestionComponent,
    ReportComponent,
    ExamSelectionComponent,
    HomeComponent,
    AboutComponent,
    EOComponent,
    UpdatepasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule, 
    MatButtonModule, 
    MatCheckboxModule,
    MatProgressBarModule,
    MatSelectModule,
    LayoutModule,
    FlexLayoutModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    ChartsModule
  ],
  providers: [PostsService, ThemeService],
  bootstrap: [AppComponent],
  entryComponents: [WarningComponent]
})
export class AppModule { }
