package com.fun.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.management.Notification;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String password;
    private String email;
    private String full_name;
    private String profile_picture;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Notification> notifications = new ArrayList<>();
}
