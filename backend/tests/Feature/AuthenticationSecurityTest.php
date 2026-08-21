<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthenticationSecurityTest extends TestCase
{
    public function test_user_id_header_cannot_impersonate_a_user(): void
    {
        $response = $this
            ->withHeader('X-User-Id', 'attacker-controlled-id')
            ->getJson('/api/user/profile');

        $response
            ->assertUnauthorized()
            ->assertJsonPath('error', 'Unauthenticated');
    }

    public function test_user_id_header_cannot_impersonate_an_admin(): void
    {
        $response = $this
            ->withHeader('X-User-Id', 'attacker-controlled-admin-id')
            ->getJson('/api/admin/posts');

        $response
            ->assertUnauthorized()
            ->assertJsonPath('error', 'Unauthenticated');
    }

    public function test_protected_write_requires_a_bearer_token(): void
    {
        $response = $this->postJson('/api/reports', [
            'reportable_type' => 'post',
            'reportable_id' => 1,
            'reason' => 'Spam',
        ]);

        $response->assertUnauthorized();
    }
}
