package com.wojciech.orchestrator.tasks;

import com.wojciech.orchestrator.devextreme.DevExtremeGetResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("tasks")
public class TaskController {
    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    DevExtremeGetResult<Task> getTasks(){
        return new DevExtremeGetResult<>(taskRepository.findAll(), taskRepository.findAll().size());
    }

    @PostMapping("/insert")
    Task addTask(@RequestBody Task task){
        Task dbTask = new Task();
        dbTask.setTaskCategory(task.getTaskCategory());
        dbTask.setTaskDescription(task.getTaskDescription());

        return taskRepository.save(dbTask);
    }

    @PutMapping("/update/{id}")
    Task updateTask(@PathVariable Long id, @RequestBody Task task) throws MissingTaskException {
        Task dbTask = taskRepository.findById(id).orElseThrow(MissingTaskException::new);

        if(task.getTaskCategory() != null) dbTask.setTaskCategory(task.getTaskCategory());
        if(task.getTaskDescription() != null) dbTask.setTaskCategory(task.getTaskDescription());

        return taskRepository.save(dbTask);
    }

    @DeleteMapping("/delete/{id}")
    void deleteTask(@PathVariable Long id){
        taskRepository.deleteById(id);
    }
}
