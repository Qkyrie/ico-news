package io.iconews.web.controller;

import io.iconews.web.repository.InitiativeStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/initiative")
public class IcoController {

    @Autowired
    private InitiativeStore initiativeStore;

    @RequestMapping(method = RequestMethod.GET, value = "/{initiative_name}")
    public String initiative(@PathVariable("initiative_name") String initiativeName) {
        return "inititive";
    }

}
