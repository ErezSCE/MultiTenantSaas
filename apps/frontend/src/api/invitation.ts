export interface InviteResponse {
  token: string;
  expiresAt: string; // ISO string
}

/**
 * Sends an invitation request to the backend.
 * @param tenantId - The tenant identifier.
 * @param email - Invitee email address.
 * @returns The invitation response from the server.
 */
export async function sendInvitation(tenantId: string, email: string): Promise<InviteResponse> {
  const response = await fetch('/auth/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tenantId, email }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to send invitation');
  }

  const data = (await response.json()) as InviteResponse;
  return data;
}
