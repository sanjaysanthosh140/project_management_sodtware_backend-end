
export const user_project_controller = async (modules: any) => {
  // interface user_todolist {
  //   project_id: string,
  //   task_id: string,
  //   user_subTaks: []
  // }
  interface tosolist {
    todo_id: String,
    title: String,
    status: String,
    createdAt: String

  }
  type user_tasks_todo_schema = {
    project_id: string,
    task_id: string,
    user_subTaks: [tosolist]
  }
  return {

    user_assigned_projects: async (id: string) => {
      let data = await modules.find({ "teamMembers.userId": id });
      return data;
    },

    employee_assigned_tasks: async (id: string, projectId: string) => {
      // console.log(id, projectId);
      let data = await modules.aggregate([
        {
          $unwind: "$employeeTasks",
        },
        {
          $match: {
            projectId: projectId,
            "employeeTasks.employee": id,
          },
        },
        {
          $project: {
            _id: 0,
            headId: 1,
            "employeeTasks.tasks": 1,
            "employeeTasks._id": 1,
          },
        },
      ]);
      // console.log(data);
      return data;
    },

    add_sub_tasks_emp: async (employee_proj_tasks: user_tasks_todo_schema | any) => {
      // console.log(employee_proj_tasks);
      let todo_data = await modules.findOneAndUpdate({
        task_id: employee_proj_tasks.task_id
      }, {
        user_subTaks: employee_proj_tasks.todolist
      })
      if (todo_data) {
        console.log("update", todo_data);
      }
      else {
        console.log(employee_proj_tasks.todolist);
        let todoData = await new modules({
          task_id: employee_proj_tasks.task_id,
          project_id: employee_proj_tasks.proj_id,
          user_subTaks: employee_proj_tasks.todolist
        })
        await todoData.save().then((data: any) => {
          console.log(data)
        }).catch((error: Error) => {
          console.log(error);
        })
      }
    }
  };
};
