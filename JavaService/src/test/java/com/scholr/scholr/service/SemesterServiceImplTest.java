package com.scholr.scholr.service;

import com.scholr.scholr.dto.SemesterRequest;
import com.scholr.scholr.entity.Semester;
import com.scholr.scholr.exception.SemesterAlreadyExistsException;
import com.scholr.scholr.repository.SemesterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SemesterServiceImplTest {

    @Mock
    private SemesterRepository semesterRepository;

    @InjectMocks
    private SemesterServiceImpl semesterService;

    private Semester testSemester;
    private SemesterRequest semesterRequest;

    @BeforeEach
    void setUp() {
        testSemester = new Semester();
        testSemester.setId(1L);
        testSemester.setSemesterNo(4);
        testSemester.setYear(2);

        semesterRequest = new SemesterRequest(4, 2);
    }

    @Test
    void testFindBySemesterNo_ShouldReturnSemester() {
        when(semesterRepository.findBySemesterNo(4)).thenReturn(testSemester);

        Semester result = semesterService.findBySemesterNo(4);

        assertThat(result).isNotNull();
        assertThat(result.getSemesterNo()).isEqualTo(4);
        verify(semesterRepository, times(1)).findBySemesterNo(4);
    }

    @Test
    void testFindBySemesterNo_NotFound_ShouldReturnNull() {
        when(semesterRepository.findBySemesterNo(10)).thenReturn(null);

        Semester result = semesterService.findBySemesterNo(10);

        assertThat(result).isNull();
        verify(semesterRepository, times(1)).findBySemesterNo(10);
    }

    @Test
    void testFindById_ShouldReturnSemester() {
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(testSemester));

        Optional<Semester> result = semesterService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        verify(semesterRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound_ShouldReturnEmpty() {
        when(semesterRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Semester> result = semesterService.findById(999L);

        assertThat(result).isEmpty();
        verify(semesterRepository, times(1)).findById(999L);
    }

    @Test
    void testAddSemester_NewSemester_ShouldSave() {
        when(semesterRepository.existsBySemesterNoAndYear(4, 2)).thenReturn(false);
        when(semesterRepository.save(any(Semester.class))).thenReturn(testSemester);

        Semester result = semesterService.addSemester(semesterRequest);

        assertThat(result).isNotNull();
        assertThat(result.getSemesterNo()).isEqualTo(4);
        assertThat(result.getYear()).isEqualTo(2);
        verify(semesterRepository, times(1)).save(any(Semester.class));
    }

    @Test
    void testAddSemester_DuplicateSemester_ShouldThrowException() {
        when(semesterRepository.existsBySemesterNoAndYear(4, 2)).thenReturn(true);

        assertThatThrownBy(() -> semesterService.addSemester(semesterRequest))
                .isInstanceOf(SemesterAlreadyExistsException.class)
                .hasMessage("Semester 4 for year 2 already exists!");

        verify(semesterRepository, never()).save(any());
    }

    @Test
    void testAddSemestersBulk_MultipleRequests_ShouldSaveAll() {
        SemesterRequest req1 = new SemesterRequest(1, 1);
        SemesterRequest req2 = new SemesterRequest(2, 1);

        Semester sem1 = new Semester();
        sem1.setId(1L);
        sem1.setSemesterNo(1);
        sem1.setYear(1);

        Semester sem2 = new Semester();
        sem2.setId(2L);
        sem2.setSemesterNo(2);
        sem2.setYear(1);

        when(semesterRepository.existsBySemesterNoAndYear(1, 1)).thenReturn(false);
        when(semesterRepository.existsBySemesterNoAndYear(2, 1)).thenReturn(false);
        when(semesterRepository.save(any(Semester.class)))
                .thenReturn(sem1)
                .thenReturn(sem2);

        List<Semester> result = semesterService.addSemestersBulk(List.of(req1, req2));

        assertThat(result).hasSize(2);
        verify(semesterRepository, times(2)).save(any(Semester.class));
    }

    @Test
    void testAddSemestersBulk_EmptyList_ShouldReturnEmptyList() {
        List<Semester> result = semesterService.addSemestersBulk(List.of());

        assertThat(result).isEmpty();
        verify(semesterRepository, never()).save(any());
    }

    @Test
    void testFindAll_ShouldReturnAllSemesters() {
        Semester sem1 = new Semester();
        sem1.setSemesterNo(1);
        Semester sem2 = new Semester();
        sem2.setSemesterNo(2);

        List<Semester> expectedList = List.of(sem1, sem2);
        when(semesterRepository.findAll()).thenReturn(expectedList);

        List<Semester> result = semesterService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result).containsExactlyInAnyOrder(sem1, sem2);
        verify(semesterRepository, times(1)).findAll();
    }

    @Test
    void testFindAll_EmptyRepository_ShouldReturnEmptyList() {
        when(semesterRepository.findAll()).thenReturn(List.of());

        List<Semester> result = semesterService.findAll();

        assertThat(result).isEmpty();
        verify(semesterRepository, times(1)).findAll();
    }

    @Test
    void testAddSemestersBulk_WithOneFailure_ShouldThrowException() {
        SemesterRequest req1 = new SemesterRequest(1, 1);
        SemesterRequest req2 = new SemesterRequest(2, 1);

        when(semesterRepository.existsBySemesterNoAndYear(1, 1)).thenReturn(false);
        when(semesterRepository.existsBySemesterNoAndYear(2, 1)).thenReturn(true);

        assertThatThrownBy(() -> semesterService.addSemestersBulk(List.of(req1, req2)))
                .isInstanceOf(SemesterAlreadyExistsException.class);
    }
}

