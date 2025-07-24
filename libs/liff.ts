import liff from '@line/liff';

const LIFF_ID = '';

let liffInitialized = false;

export async function initLiff() {
  if (typeof window === 'undefined') return;

  if (!liffInitialized) {
    await liff.init({ liffId: LIFF_ID });
    liffInitialized = true;
  }
  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

export async function shareReportToLine({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) {
  if (typeof window === 'undefined') return;
  await initLiff();
  if (liff.isApiAvailable('shareTargetPicker')) {
    await liff.shareTargetPicker([
      {
        type: 'flex',
        altText: title,
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: imageUrl,
            size: 'full',
            aspectRatio: '1:1',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: title,
                weight: 'bold',
                size: 'md',
                wrap: true,
              },
              {
                type: 'text',
                text: description,
                size: 'sm',
                wrap: true,
                margin: 'md',
              },
            ],
          },
        },
      },
    ]);
  } else {
    alert('LINE shareTargetPicker is not available.');
  }
}