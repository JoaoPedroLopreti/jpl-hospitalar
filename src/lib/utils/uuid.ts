/**
 * UUID Validation Utility
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(uuid: string | undefined | null): boolean {
    if (!uuid || typeof uuid !== 'string') {
        return false
    }
    return UUID_REGEX.test(uuid)
}

export function validateUUID(uuid: string | undefined | null, fieldName = 'ID'): string {
    if (!isValidUUID(uuid)) {
        throw new Error(`Invalid ${fieldName}: expected UUID, got "${uuid}"`)
    }
    return uuid!
}
