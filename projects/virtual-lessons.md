---
tags: ['project']
date: 2020-08-25
title: 15-466 Virtual Lessons
blurb: A web framework for creating online C++ lessons for Carnegie Mellon's Computer Game Programming course.
tools: ['HTML/CSS', 'Emscripten', 'Apache', 'Shibboleth']
thumbnail: logo-f20-extended.svg
layout: layouts/project.njk
---
This online infrastructure allows students to easily read, complete, and run C++-based lessons through the course website. The framework generates interactive web pages from doxygen-like lesson source files. It also records student submissions for instructor grading. The server includes a mechanism to compile C++ code into WebAssembly, allowing users to execute simple C++ programs directly in the browser. This website is implemented with Django and deployed with Apache, SSL certification, and single-service sign on through Carnegie Mellon University using Shibboleth.

I was the sole developer of this project, so I was entirely responsible for designing, implementing, and deploying the framework according to specifications provided by Jim McCann, professor of Computer Game Programming.