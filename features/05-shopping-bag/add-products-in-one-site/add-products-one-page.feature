
Feature: add products in one site

  In order to shop when I'm inspired
  As Edna
  I want to add products to my bag while I read a fashion blog

  Scenario Outline: add 1 product
    Given I visit "/blogs/instyle/index.html"
    When I add <product> to my bag
    Then my shopping bag has:
      | product   | quantity |
      | <product> | 1        |
  Examples:
    | product                              |
    | Fayda Leather Motorcycle Jacket      |
    | Beckett Metallic Envelope Clutch Bag |
