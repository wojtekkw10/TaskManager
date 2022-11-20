package com.wojciech.orchestrator.tasks;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("tasks")
public class TaskController {
    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    String getTasks(){
        taskRepository.findAll().forEach(System.out::println);
        return "{\"data\": [{\"taskId\": \"12\", \"taskName\": \"task name\", \"taskCategory\": \"lak\"}], \"totalCount\": \"1\"}";
    }
}
