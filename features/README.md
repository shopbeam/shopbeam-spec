
This folder contains:

- **Product Specification** written in clean, user-perspective, plain-english documentation: conceptual definitions (*.md markdown files and related media) and examples (*.feature gherkin files)
- **Test Automation Code** that turn (most) spec examples into executable feature/integration tests (/step_definitions and /support folders)

Specs
------

All specs in this folder are written:
- from a user perspective
- in plain-english, anyone knowing that language can edit them (using a github account with enough permissions, even on the github web editor)
- DRY
- verifyable against the real product, and therefore forcedly up-to-date (otherwise **product is broken**)

Following the spirit of [Jeff Patton's Backlog Maps](http://www.agileproductdesign.com/blog/the_new_backlog.html), specs are organized in [Personas][1] (a UX approach to identify user stereotypes), and functionality organized in a 3 level hierarchy: Activities, Flows and Features.

  [1]: http://en.wikipedia.org/wiki/Persona_(user_experience)

### Personas

on ```/personas``` folder each *.md file describes a [Persona][1], please copy ```_template.md``` when adding one.

All users mentioned in user stories should be identified as one of this personas, so this is the foundation of the next sections.

### Activities

> (extract from Jeff Patton article linked above)
>
> An activity is sort of a big thing that people do – something that has lots of steps, and doesn't always have a precise workflow. If I was building an email system (which I'd never be foolish enough to do) I might have an activity called: "managing email", and "configuring email servers", and "setting up out of office responses."
>
> A story for an "activity" might read: As a consultant I want to manage my email so I can keep up with clients, colleagues, and friends.
>
>But that's way too big of a story to put into an iteration or sprint.

Numbered folders at first level under /features represent Activities, folders are prefixed with 2-digit numbers to keep them in order.

> When teaching this, people often tell me "the users can perform these in any order. What order should I put them in?" I'll ask them to "explain to me what the system does at a high level - just tell me the activities." They then recite them to me. "That's the order" I say

Each Activity folder contains a README.md file describing it, and one or more...

### Flows

A Flow is a task the user performs to reach a goal, tipically in a single browser session. (These are called just "tasks" by Jeff Patton, though the "Flow" word:
- better describes the single-session butt-in-the-chair idea
- avoids confusion with the word "task" in other context (eg. developer tasks)
- perfectly matches the idea of [FlowChart](http://en.wikipedia.org/wiki/Flowchart)

Each folder inside an Activity folder represents a flow.
Each Flow folder contains a README.md describing it, and one or more...

### Features

The smallest unit of cohesive functionality. A common criteria is match Features granularity to the XP concept of User Story.
That's why the classic Feature template contains a User Story (In order to/as a/I want) at the top of the file, followed by the Acceptance Criteria expressed as examples (Scenarios in gherkin language).
Although, tipically a User Story is a planning tool, a backlog item that once developed is absorbed into one or many Features.

Features are described using [gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) (*.feature files), which is pretty close to a plain text (or markdown) document, but following a particular syntax when describing Scenarios, particular examples that specify the system behavior using a Given/When/Then format.

The purpose of using gherkin is that developers and qa engineers con work writing automation code that allows to execute Scenario steps against an instance of this product, validating its correctness. This is useful detecting regressions, but more importantly guiding design and development early on.

Feature files represent an excellent opportunity of collaboration between product, development and qa roles.

#### Feature Flags

Ideally non-trivial features would have configuration flags allowing to turn them on/off for specific users allowing to:
- test their impact in user behavior (A/B testing with cohort analysis), and learn from it
- canary releases, getting early feedback, improving stability and disaster recovery
- allow for earlier code integration (even when features are not yet production-ready)

Automation
---------

Finally to make the specs above executable, code that provides automation for each of the gherkin steps is written in the ```/steps_definitions``` folder.

This code is executed with [cucumber.js](https://github.com/cucumber/cucumber-js) and browser automation is done using [webdriver.io](http://webdriver.io/), a high-level real-user-like browser automation DSL, behind the scenes different drivers allow to test the feature scenarios using different browsers on different platforms.

Step definition files are roughly organized around pages or page/ui section types (always from the user perspecive), and finally an object-oriented approach is taken to encapsulate UI logic, following the Page Objects pattern. Page objects are stored on ```/step_definitions/pages``` folder.

Please read the README.md files inside these folders before contributing to them.

Visualizations
------

Organizing gherkin feature files following a Backlog Map structure, opens the door for some interesting opportunities for automatic information radiators, that can be built writing a simple cucumber reporter.

- A Product Map with indication (maybe using colors) of Features (or Flows, or Activities) that are working, under development, pending, or broken.
- A Backlog Map (showing pending features) adding priorities or milestones to spec items.
- Heat maps representing different variables like history-relative performance, test-stability or estimated business value.
