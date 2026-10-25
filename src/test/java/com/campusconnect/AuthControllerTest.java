package com.campusconnect;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/register should create student and return 201 Created")
    void testRegisterEndpointSuccess() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("name", "Nova Zenith");
        request.put("email", "nova.zenith@srmist.edu.in");
        request.put("registrationNumber", "RA2511009990888");
        request.put("password", "SecureGalaxy@2030");
        request.put("department", "Cybernetics & Systems");
        request.put("academicYear", "Year 3 Gamma");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.student.name").value("Nova Zenith"))
                .andExpect(jsonPath("$.student.email").value("nova.zenith@srmist.edu.in"))
                .andExpect(jsonPath("$.student.passwordHash").doesNotExist()); // Ensure password hash is never exposed
    }

    @Test
    @DisplayName("POST /api/auth/register with invalid email should return 400 Bad Request")
    void testRegisterValidationFailure() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("name", "N"); // Too short
        request.put("email", "not-a-valid-email");
        request.put("registrationNumber", "");
        request.put("password", "123"); // Too short

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.details").isMap());
    }

    @Test
    @DisplayName("POST /api/auth/login with pre-seeded official team account should succeed")
    void testLoginSuccess() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("email", "sv0029@srmist.edu.in");
        request.put("password", "Pass@2030");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.student.registrationNumber").value("RA2511003040029"));
    }

    @Test
    @DisplayName("GET /api/events should return public events list")
    void testGetEventsEndpoint() throws Exception {
        mockMvc.perform(get("/api/events")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("GET /api/javalab/modules should return 2030 systems catalog")
    void testGetJavaLabModulesEndpoint() throws Exception {
        mockMvc.perform(get("/api/javalab/modules")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
