
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project, Task } from '../../assets/Project';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  
  projectDetails:any|Project;
  currentCardTaskStatus:any;


  constructor(private projectService:ProjectService){}

  ngOnInit(): void {
    let currentUserName=history.state.ProjectName;

    this.projectService.getProject(currentUserName).subscribe(
      response=>{ 
        this.projectDetails=response;
        console.log('-----------------------------');
      },
      error=>alert("There was error fetching Project Details")    
    )
  }

  // ----Array of arrays for the task;
    
    drop(event: CdkDragDrop<Task[]>) {
      this.getThePriorityTasks();
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
       
        if (event.container.id === "cdk-drop-list-1" && !this.getNumberOfTaskInWIP()) {
          return;
        }
        if (event.container.id === "cdk-drop-list-1" && this.getThePriorityTasks()) {
          return;
        }
        transferArrayItem(
          event.previousContainer.data,
          event.container.data as Task[],
          event.previousIndex,
          event.currentIndex
        );
      }
      console.log(this.projectDetails);
    }

getColumnNames() {
   return Object.keys(this.projectDetails.columns);
}

getColumnTasks(columnName: string) {
    return this.projectDetails.columns[columnName];
  }


// ------------------------------methods for manipulation of content

  getNumberOfTaskInWIP(): boolean{
   let num= this.projectDetails.columns["In Progress"].length
         return num<=4;
  }

  getThePriorityTasks(){
    let mediumCount=0;
    let highCount=0;
    let lowCount=0;
    for(let i =0; i<this.projectDetails.columns["To Do"].length;i++){
      if(this.projectDetails.columns["To Do"][i].priority=="High"){
        highCount++;
      }
      if(this.projectDetails.columns["To Do"][i].priority=="Low"){
        lowCount++;
      }
      if(this.projectDetails.columns["To Do"][i].priority=="Medium"){
        mediumCount++;
      }
    }
  
    let sum=lowCount+mediumCount;
    if(sum>lowCount&&(this.currentCardTaskStatus=="Low" ||this.currentCardTaskStatus=="Medium")){
      alert(true)
      return true;
    } else{
      alert(false)
      return false;
    } 
  }
  onDrag(task:any){
    this.currentCardTaskStatus=task.priority;
  }
}