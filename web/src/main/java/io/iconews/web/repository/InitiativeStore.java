package io.iconews.web.repository;

import org.springframework.stereotype.Component;

@Component
public class InitiativeStore {

    public String initiative(String name) {
        return name;
    }

}
