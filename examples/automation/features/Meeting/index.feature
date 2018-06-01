@saleforce
Feature: Schedule meeting

    @P2 @MT
    Scenario Outline:
        Given Path:<path>
        Then '[login user's name]'s Meeting' should display by default
        And the textfield can be editedÒ
        Examples:
            | path                  |
            | schedule_meeting_path |