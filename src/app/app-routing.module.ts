import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './module/login/login.component';
import { ProfileComponent } from './module/profile/profile.component';
import { PostsComponent } from './posts/posts.component';
import { DashboardComponent } from './module/dashboard/dashboard.component';
import { ExamComponent } from './module/exam/exam.component';
import { ResultComponent } from './module/result/result.component';
import { MaterialComponent } from './module/material/material.component';
import { UsersComponent } from './module/users/users.component';
import { AdminDashboardComponent } from './module/admin-dashboard/admin-dashboard.component';
import { QuestionsComponent } from './module/questions/questions.component';
import { QuestionComponent } from './module/question/question.component';
import { ReportComponent } from './module/report/report.component';
import { ExamSelectionComponent } from './module/exam-selection/exam-selection.component';
import { HomeComponent } from './module/home/home.component';
import { AboutComponent } from './module/about/about.component';
import { EOComponent } from './module/eo/eo.component';

const ROUTES = [
  // {
  //   path: '',
  //   redirectTo: 'material',
  //   pathMatch: 'full'
  // },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'exam', component: ExamSelectionComponent },
  { path: 'test', component: ExamComponent },
  { path: 'result', component: ResultComponent },
  { path: 'material', component: MaterialComponent },
  { path: 'administer-access', component: AdminDashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'questions', component: QuestionsComponent},
  { path: 'administer-user', component: UsersComponent },
  { path: 'administer-question', component: QuestionComponent },
  { path: 'administer-report', component: ReportComponent },
  { path: 'eo/:id/jt56eqw7', component: EOComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
