package com.scholr.scholr.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "teacher_details")
@PrimaryKeyJoinColumn(name = "user_id") // Link to User's ID
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Teacher extends User {
    private boolean isHod;
    private boolean isClassTeacher; // only class teacher can mark attendance

//    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
//    private List<Subject> subjects;
}
