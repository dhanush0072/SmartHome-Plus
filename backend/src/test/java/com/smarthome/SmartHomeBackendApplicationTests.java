package com.smarthome;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import java.security.SecureRandom;
import java.util.Base64;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarthome.user.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
class SmartHomeBackendApplicationTests {
	private static final String TEST_JWT_SECRET = createTestJwtSecret();

	@DynamicPropertySource
	static void securityProperties(DynamicPropertyRegistry registry) {
		registry.add("app.security.jwt-secret", () -> TEST_JWT_SECRET);
	}

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository users;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void registrationHashesPasswordAndIssuesJwtForCurrentUser() throws Exception {
		String email = "auth-" + UUID.randomUUID() + "@example.com";
		String token = register(email);

		var account = users.findByEmailIgnoreCase(email).orElseThrow();
		assertThat(account.getPassword()).isNotEqualTo("a-very-long-test-password");
		assertThat(passwordEncoder.matches("a-very-long-test-password", account.getPassword())).isTrue();

		mockMvc.perform(api(get("/api/auth/me")).header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value(email));
	}

	@Test
	void privateEndpointsRequireAuthenticationAndAdminRole() throws Exception {
		mockMvc.perform(api(get("/api/rooms"))).andExpect(status().isUnauthorized());

		String token = register("member-" + UUID.randomUUID() + "@example.com");
		mockMvc.perform(api(get("/api/admin/overview")).header("Authorization", "Bearer " + token))
				.andExpect(status().isForbidden());
	}

	@Test
	void roomAccessIsScopedToTheAuthenticatedAccount() throws Exception {
		String ownerToken = register("owner-" + UUID.randomUUID() + "@example.com");
		String otherToken = register("other-" + UUID.randomUUID() + "@example.com");

		String roomJson = mockMvc.perform(api(post("/api/rooms")
						.header("Authorization", "Bearer " + ownerToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"name\":\"Living Room\",\"description\":\"Main area\"}")))
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();
		JsonNode room = objectMapper.readTree(roomJson);

		mockMvc.perform(api(get("/api/rooms/" + room.get("id").asText())
						.header("Authorization", "Bearer " + otherToken)))
				.andExpect(status().isNotFound());
	}

	private String register(String email) throws Exception {
		String body = objectMapper.writeValueAsString(new RegistrationPayload(
				email, "a-very-long-test-password", "Test", "User"));
		String response = mockMvc.perform(api(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON).content(body)))
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();
		return objectMapper.readTree(response).get("accessToken").asText();
	}

	private MockHttpServletRequestBuilder api(MockHttpServletRequestBuilder request) {
		return request.contextPath("/api");
	}

	private static String createTestJwtSecret() {
		byte[] secret = new byte[32];
		new SecureRandom().nextBytes(secret);
		return Base64.getEncoder().encodeToString(secret);
	}

	private record RegistrationPayload(String email, String password, String firstName, String lastName) {}
}
