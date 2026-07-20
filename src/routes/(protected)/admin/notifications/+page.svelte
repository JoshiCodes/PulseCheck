<script>
import { goto } from '$app/navigation';
import Badge from '$lib/components/Badge.svelte';
import Button from '$lib/components/form/Button.svelte';
import NotificationProviderContainer from '$lib/components/NotificationProviderContainer.svelte';
import Checkbox from '$lib/components/form/Checkbox.svelte';
import Input from '$lib/components/form/Input.svelte';

const providers = [];

</script>

<div class="space-y-8">
	<header>
		<h1 class="text-3xl font-bold">Notification Providers</h1>
		<p class="text-zinc-500">Manage how notifications reach you.</p>
	</header>

	<div class="">
		<div class="mt-2 md:mt-4">
			<NotificationProviderContainer title="Email (SMTP)">
				<form action="?" method="post">
					<Checkbox id="mail-enabled" name="mail-enabled" label="Enabled" />
					<div class="mt-2 md:grid md:grid-cols-2 w-[50%]">
						<Input id="mail-host" name="mail-host" label="SMTP Host" class="w-1/3" />
						<Input id="mail-host" name="mail-host" label="SMTP Host" />
					</div>
				</form>
			</NotificationProviderContainer>
		</div>
	</div>
</div>