Set up secure personal context management system

1. Create a personal context system that reads from LLM_SECRETS:
   - Add functionality to load and parse personal information from LLM_SECRETS
   - Create a structured way to access personal context during conversations and jobs
   - Design it to gracefully handle when no personal context is available

2. Update the personality and behavior files:
   - Modify `operating_system/SOUL.md` to include instructions for using personal context
   - Update `operating_system/CHATBOT.md` to incorporate personal information appropriately in conversations
   - Ensure the agent can reference personal details naturally when relevant

3. Create a private context storage system:
   - Set up a method to store and retrieve personal notes/context in the `/logs/` directory
   - Create templates for organizing different types of personal information
   - Build a system to update and maintain this context over time

4. Add documentation:
   - Create clear instructions on how to structure personal information in LLM_SECRETS
   - Document the JSON format for personal context
   - Provide examples of what kinds of information work well

5. Test the system:
   - Verify personal context loads correctly when available
   - Ensure system works normally when no personal context is provided
   - Test that private information stays in appropriate places

6. Create example templates for organizing personal information securely