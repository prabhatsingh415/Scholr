package com.scholr.scholr.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "teacher_details")
@PrimaryKeyJoinColumn(name = "user_id") // Link to User's ID
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Teacher extends User {
    private boolean isHod;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"teacher", "hibernateLazyInitializer", "handler"})
    private List<Subject> subjects;
}
