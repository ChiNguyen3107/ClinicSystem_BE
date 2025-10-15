package vn.project.ClinicSystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String sayHello() {
        // if (true) {
        // throw new IdInvalidException("check mate nhannguyen");
        // }

        return "Chào Mừng bạn đến với thế giới của tôi";
    }

}