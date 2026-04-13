package org.example.projectecommerce.config;

import org.example.projectecommerce.entity.Role;
import org.example.projectecommerce.entity.User;
import org.example.projectecommerce.repository.RoleRepository;
import org.example.projectecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Créer les rôles s'ils n'existent pas
        getOrCreateRole("CLIENT");
        Role adminRole    = getOrCreateRole("ADMIN");
        Role superRole    = getOrCreateRole("SUPER_ADMIN");

        // Créer admin si inexistant
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            System.out.println("✅ User 'admin' créé (password: admin123)");
        }

        // Créer superadmin si inexistant
        if (userRepository.findByUsername("superadmin").isEmpty()) {
            User superAdmin = new User();
            superAdmin.setUsername("superadmin");
            superAdmin.setPassword(passwordEncoder.encode("admin123"));
            superAdmin.setRoles(Set.of(superRole));
            userRepository.save(superAdmin);
            System.out.println("✅ User 'superadmin' créé (password: admin123)");
        }
    }

    private Role getOrCreateRole(String name) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role r = new Role();
            r.setName(name);
            return roleRepository.save(r);
        });
    }
}
