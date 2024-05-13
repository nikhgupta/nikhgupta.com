<script lang="ts">
	import qrcode from 'qrcode-generator';

	export let url = '';

	let qrCodeSvg: any;

	$: if (url) {
		let qr = qrcode(0, 'L');
		qr.addData(url);
		qr.make();
		qrCodeSvg = qr.createSvgTag({});
	}
</script>

<div>
	{@html qrCodeSvg}
</div>
