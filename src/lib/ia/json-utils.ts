/**
 * JSON REPAIR UTILITIES
 * Attempts to fix common JSON formatting errors
 */

export function tryRepairJSON(brokenJson: string): string {
    let fixed = brokenJson

    // Remove trailing commas before closing braces/brackets
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

    // Fix single quotes to double quotes (but preserve apostrophes in text)
    // This is tricky, so we'll be conservative
    fixed = fixed.replace(/'([^']*?)'/g, '"$1"')

    // Remove any control characters
    fixed = fixed.replace(/[\x00-\x1F\x7F-\x9F]/g, '')

    // Fix common escape issues
    fixed = fixed.replace(/\\/g, '\\\\').replace(/\\\\/g, '\\')

    return fixed
}

export function extractAndCleanJSON(text: string): string {
    let cleaned = text.trim()

    // Remove markdown code blocks
    if (cleaned.includes('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/gi, '')
        cleaned = cleaned.replace(/\s*```\s*$/g, '')
        cleaned = cleaned.trim()
    }

    // Find JSON boundaries
    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
    }

    // Try to repair common issues
    cleaned = tryRepairJSON(cleaned)

    return cleaned
}

export function parseJSONSafely<T>(text: string): T {
    // Try direct parse first
    try {
        return JSON.parse(text) as T
    } catch (firstError) {
        // Try with cleaning
        const cleaned = extractAndCleanJSON(text)

        try {
            return JSON.parse(cleaned) as T
        } catch (secondError) {
            // Last resort: try to repair
            const repaired = tryRepairJSON(cleaned)

            try {
                return JSON.parse(repaired) as T
            } catch (finalError) {
                console.error('JSON parsing failed after all attempts')
                console.error('Original text (first 500 chars):', text.substring(0, 500))
                console.error('Cleaned text (first 500 chars):', cleaned.substring(0, 500))
                throw new Error(`Failed to parse JSON: ${finalError}. Original error: ${firstError}`)
            }
        }
    }
}
