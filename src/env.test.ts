const REQUIRED_NON_EMPTY_STRING_VARS = [
    { name: 'AIRTABLE_API_KEY', expectedErrorMsg: "Missing AIRTABLE_API_KEY" },
    { name: 'BASE_ID', expectedErrorMsg: /Missing BASE_ID/ },
    { name: 'MEETING_TABLE_ID', expectedErrorMsg: /Missing MEETING_TABLE_ID/ },
    { name: 'MEETING_VIEW_ID', expectedErrorMsg: /Missing MEETING_VIEW_ID/ },
    { name: 'PROGRAM_OPTIONS_TABLE_ID', expectedErrorMsg: /Missing PROGRAM_OPTIONS_TABLE_ID/ },
    { name: 'EIR_BASE_ID', expectedErrorMsg: /Missing EIR_BASE_ID/ },
    { name: 'EIR_PROFILE_TABLE_ID', expectedErrorMsg: /Missing EIR_PROFILE_TABLE_ID/ },
    { name: 'EIR_PROFILE_VIEW_ID', expectedErrorMsg: /Missing EIR_PROFILE_VIEW_ID/ },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', expectedErrorMsg: /Missing NEXT_PUBLIC_SUPABASE_URL/ },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', expectedErrorMsg: /Missing NEXT_PUBLIC_SUPABASE_ANON_KEY/ },
    // Add any other variables that follow this rule
];

// Define a base set of valid environment variables
const SANE_DEFAULT_ENV_VALUES: Record<string, string> = {
    AIRTABLE_API_KEY: "default_api_key",
    BASE_ID: "default_base_id",
    MEETING_TABLE_ID: "default_meeting_table_id",
    MEETING_VIEW_ID: "default_meeting_view_id",
    PROGRAM_OPTIONS_TABLE_ID: "default_program_options_id",
    EIR_BASE_ID: "default_eir_base_id",
    EIR_PROFILE_TABLE_ID: "default_eir_profile_table_id",
    EIR_PROFILE_VIEW_ID: "default_eir_profile_view_id",
    NEXT_PUBLIC_SUPABASE_URL: "https://default.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "default_supabase_anon_key",
};



describe('Environment Variable Validation (Parameterized)', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = { ...process.env }; // Snapshot original env
    });

    beforeEach(() => {
        jest.resetModules(); // Clear module cache for './env'
        process.env = { ...originalEnv }; // Restore to a clean state
        // Apply sane defaults for each test run before specific modification
        for (const key in SANE_DEFAULT_ENV_VALUES) {
            process.env[key] = SANE_DEFAULT_ENV_VALUES[key];
        }
    });

    afterAll(() => {
        process.env = originalEnv; // Restore original env after all tests
    });

    describe('when a required variable is an empty string', () => {
        test.each(REQUIRED_NON_EMPTY_STRING_VARS)(
            'should throw an error if $name is an empty string',
            async ({ name, expectedErrorMsg }) => {
                process.env[name] = ""; // Set the specific variable under test to be empty

                await expect(import('./env')).rejects.toThrowError(expectedErrorMsg);
            }
        );
    });

    describe('when a required variable is missing (undefined)', () => {
        test.each(REQUIRED_NON_EMPTY_STRING_VARS)(
            'should throw a ZodError with a "Required" message for $name',
            async ({ name }) => {
                delete process.env[name]; // Delete the specific variable under test
    
                try {
                    await import('./env');
                    // If the import succeeds, this line will be reached, and the test should fail.
                    fail(`The import should have failed because ${name} is missing.`);
                } catch (error: any) {
                    // 1. Verify it's a ZodError
                    expect(error.name).toBe('ZodError');
    
                    // 2. Find the specific issue related to the missing variable
                    // Zod errors have an 'issues' array.
                    const relevantIssue = error.issues.find((issue: any) =>
                        issue.path.length === 1 && issue.path[0] === name
                    );
    
                    // 3. Assert that the issue for 'name' exists
                    expect(relevantIssue).toBeDefined();
    
                    // 4. Assert the details of this specific issue
                    if (relevantIssue) {
                        expect(relevantIssue.message).toBe('Required');
                        expect(relevantIssue.code).toBe('invalid_type');
                        expect(relevantIssue.expected).toBe('string');
                        expect(relevantIssue.received).toBe('undefined');
                    }
                }
            }
        );
    });

});

