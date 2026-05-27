package com.scholr.scholr.service;

import com.scholr.scholr.entity.Department;
import com.scholr.scholr.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    private Department testDepartment;

    @BeforeEach
    void setUp() {
        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setDeptId("CS01");
        testDepartment.setDeptName("Computer Science");
    }

    @Test
    void testFindById_ShouldReturnDepartment() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(testDepartment));

        Optional<Department> result = departmentService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getDeptName()).isEqualTo("Computer Science");
        verify(departmentRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound_ShouldReturnEmpty() {
        when(departmentRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Department> result = departmentService.findById(999L);

        assertThat(result).isEmpty();
        verify(departmentRepository, times(1)).findById(999L);
    }

    @Test
    void testFindById_WithValidId_ShouldReturnCorrectDepartment() {
        Department expectedDept = new Department();
        expectedDept.setId(2L);
        expectedDept.setDeptName("Mechanical Engineering");

        when(departmentRepository.findById(2L)).thenReturn(Optional.of(expectedDept));

        Optional<Department> result = departmentService.findById(2L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(2L);
        assertThat(result.get().getDeptName()).isEqualTo("Mechanical Engineering");
    }

    @Test
    void testFindById_CalledMultipleTimes_ShouldReturnConsistentResults() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(testDepartment));

        Optional<Department> result1 = departmentService.findById(1L);
        Optional<Department> result2 = departmentService.findById(1L);

        assertThat(result1).isEqualTo(result2);
        verify(departmentRepository, times(2)).findById(1L);
    }
}

