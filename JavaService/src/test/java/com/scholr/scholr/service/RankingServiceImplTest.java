package com.scholr.scholr.service;

import com.scholr.scholr.dto.StudentRankingResponse;
import com.scholr.scholr.entity.Batch;
import com.scholr.scholr.entity.Department;
import com.scholr.scholr.entity.Semester;
import com.scholr.scholr.entity.Student;
import com.scholr.scholr.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RankingServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private RankingServiceImpl rankingService;

    private Department testDepartment;
    private Semester testSemester;
    private Batch testBatch;
    private Student student1;
    private Student student2;
    private Student student3;

    @BeforeEach
    void setUp() {
        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setDeptName("Computer Science");

        testBatch = new Batch();
        testBatch.setBatchId(1L);

        testSemester = new Semester();
        testSemester.setId(1L);
        testSemester.setSemesterNo(4);
        testSemester.setYear(2);

        student1 = new Student();
        student1.setUserId(1L);
        student1.setCollegeId("STU001");
        student1.setFirstName("John");
        student1.setLastName("Doe");
        student1.setCgpa(8.5);
        student1.setDepartment(testDepartment);
        student1.setSemester(testSemester);

        student2 = new Student();
        student2.setUserId(2L);
        student2.setCollegeId("STU002");
        student2.setFirstName("Jane");
        student2.setLastName("Smith");
        student2.setCgpa(8.2);
        student2.setDepartment(testDepartment);
        student2.setSemester(testSemester);

        student3 = new Student();
        student3.setUserId(3L);
        student3.setCollegeId("STU003");
        student3.setFirstName("Mike");
        student3.setLastName("Brown");
        student3.setCgpa(7.8);
        student3.setDepartment(testDepartment);
        student3.setSemester(testSemester);
    }

    @Test
    void testGetRankings_ShouldReturnRankedStudents() {
        List<Student> students = List.of(student1, student2, student3);
        when(studentRepository.findRankings(1L, 2)).thenReturn(students);

        List<StudentRankingResponse> result = rankingService.getRankings(1L, 2);

        assertThat(result).isNotNull();
        assertThat(result).hasSize(3);
        assertThat(result.get(0).rank()).isEqualTo(1);
        assertThat(result.get(0).name()).isEqualTo("John Doe");
        assertThat(result.get(0).collegeId()).isEqualTo("STU001");
        assertThat(result.get(0).cgpa()).isEqualTo(8.5);
        verify(studentRepository, times(1)).findRankings(1L, 2);
    }

    @Test
    void testGetRankings_SecondStudent_ShouldHaveCorrectRank() {
        List<Student> students = List.of(student1, student2, student3);
        when(studentRepository.findRankings(1L, 2)).thenReturn(students);

        List<StudentRankingResponse> result = rankingService.getRankings(1L, 2);

        assertThat(result.get(1).rank()).isEqualTo(2);
        assertThat(result.get(1).name()).isEqualTo("Jane Smith");
        assertThat(result.get(1).cgpa()).isEqualTo(8.2);
    }

    @Test
    void testGetRankings_ThirdStudent_ShouldHaveCorrectRank() {
        List<Student> students = List.of(student1, student2, student3);
        when(studentRepository.findRankings(1L, 2)).thenReturn(students);

        List<StudentRankingResponse> result = rankingService.getRankings(1L, 2);

        assertThat(result.get(2).rank()).isEqualTo(3);
        assertThat(result.get(2).name()).isEqualTo("Mike Brown");
        assertThat(result.get(2).cgpa()).isEqualTo(7.8);
    }

    @Test
    void testGetRankings_EmptyList_ShouldReturnEmptyList() {
        when(studentRepository.findRankings(1L, 2)).thenReturn(List.of());

        List<StudentRankingResponse> result = rankingService.getRankings(1L, 2);

        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }

    @Test
    void testGetRankings_ShouldIncludeDepartmentInfo() {
        List<Student> students = List.of(student1);
        when(studentRepository.findRankings(1L, 2)).thenReturn(students);

        List<StudentRankingResponse> result = rankingService.getRankings(1L, 2);

        assertThat(result.get(0).departmentName()).isEqualTo("Computer Science");
    }

    @Test
    void testGetRankings_ShouldIncludeSemesterInfo() {
        List<Student> students = List.of(student1);
        when(studentRepository.findRankings(1L, 2)).thenReturn(students);

        List<StudentRankingResponse> result = rankingService.getRankings(1L, 2);

        assertThat(result.get(0).semesterNo()).isEqualTo(4);
        assertThat(result.get(0).academicYear()).isEqualTo(2);
    }

    @Test
    void testGetRankings_WithNullDepartmentId_ShouldStillWork() {
        List<Student> students = List.of(student1, student2);
        when(studentRepository.findRankings(null, 2)).thenReturn(students);

        List<StudentRankingResponse> result = rankingService.getRankings(null, 2);

        assertThat(result).hasSize(2);
        verify(studentRepository, times(1)).findRankings(null, 2);
    }

    @Test
    void testGetRankings_WithNullYear_ShouldStillWork() {
        List<Student> students = List.of(student1, student2);
        when(studentRepository.findRankings(1L, null)).thenReturn(students);

        List<StudentRankingResponse> result = rankingService.getRankings(1L, null);

        assertThat(result).hasSize(2);
        verify(studentRepository, times(1)).findRankings(1L, null);
    }
}

