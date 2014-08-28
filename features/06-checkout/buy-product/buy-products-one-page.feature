
Feature: buy products in one site

  In order to receive the products I selected
  As Edna
  I want to to complete shopping bag checkout

  Scenario Outline: buy 1 product
    Given I visit "/blogs/instyle/index.html"
    When I add <product> to my bag
     And I complete checkout
    Then I see purchase confirmation
     And I receive a purchase confirmation email
  Examples:
    | product                              |
    | Fayda Leather Motorcycle Jacket      |
