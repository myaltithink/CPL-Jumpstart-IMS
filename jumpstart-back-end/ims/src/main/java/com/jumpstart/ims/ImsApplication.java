package com.jumpstart.ims;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.jumpstart.ims.models.Role;
import com.jumpstart.ims.models.Account;
import com.jumpstart.ims.repository.RoleRepository;
import com.jumpstart.ims.repository.AccountRepository;

@SpringBootApplication
public class ImsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ImsApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase() {
		return (args) -> {
			System.out.println("\n================================================");
			System.out.println("Initializing Database Seeder\n");
			this.createRoles();
			this.createRootAdmin();
			System.out.println("\nInitialization Complete");
			System.out.println("================================================\n");
		};
	}

	@Autowired
	private RoleRepository roleRepository;

	private void createRoles() {
		System.out.println("Checking Roles...");
		if (roleRepository.findAll().size() == 0) {
			System.out.println("Initializing Roles...");
			String[] roles = { "ROLE_USER", "ROLE_ADMIN", "ROLE_ROOT_ADMIN" };
			for (String role : roles) {
				roleRepository.save(new Role(role));
			}
		}
	}

	@Autowired
	private AccountRepository userRepository;

	private void createRootAdmin() {
		System.out.println("Checking Root Admin...");
		Optional<Account> admin = userRepository.findByUsername("admin@gmail.com");
		if (!admin.isPresent()) {
			System.out.println("Initializing Root Admin...");
			PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
			userRepository.save(
					new Account(
							"admin@gmail.com",
							passwordEncoder.encode("wasdwasd"),
							roleRepository.findByRole("ROLE_ROOT_ADMIN"),
							new Date()));
		}
	}

}
