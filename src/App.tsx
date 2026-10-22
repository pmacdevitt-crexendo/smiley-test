import type { ExtensionComponentProps, FlowContext } from '@netsapiens/flow-sdk';
import { useEffect } from 'react';
import { useRemoteApp } from '@netsapiens/flow-sdk';

declare const __MF_NAME__: string;

// One tiny component, reused in every zone. Built from the host kit so it
// follows the portal's theme and dark/light toggle.
function Smiley({ context }: ExtensionComponentProps) {
  const { Typography } = context.ui ?? {};
  if (!Typography) return <span>😊</span>; // kit-unavailable fallback
  return (
    <Typography component='span' variant='h6' aria-label='smiley face'>
      😊
    </Typography>
  );
}

export default function App(flowContext: FlowContext) {
  const { sdk } = useRemoteApp(flowContext, __MF_NAME__);

  useEffect(() => {
    const everywhere = [{ pattern: '/*' }];

    // 1. Top app bar — visible on every page.
    sdk.registerDynamicExtension({
      id: 'smiley-topbar',
      zone: 'topbar-actions',
      routes: everywhere,
      component: Smiley,
    });

    // 2. Next to the page title.
    sdk.registerDynamicExtension({
      id: 'smiley-header',
      zone: 'page-header-secondary',
      routes: everywhere,
      component: Smiley,
    });

    // 3. At the bottom of page content.
    sdk.registerDynamicExtension({
      id: 'smiley-footer',
      zone: 'page-content-after',
      routes: everywhere,
      component: Smiley,
    });
  }, [sdk]);

  return null; // headless: all UI goes into host zones
}
