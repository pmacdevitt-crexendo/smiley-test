# Smiley Faces

A tiny NetSapiens Flow remote that drops a 😊 into three spots on every page:
the top app bar, beside the page title, and at the bottom of page content.

## Run locally

    npm install
    npm run dev      # serves http://localhost:5010/remoteEntry.js

## Build and check

    npm run build
    npm run verify   # same checks the platform runs

## Register with Flow

Platform → UI SDK Management → Registered Apps → Add App, with
`webpack_module: smileyFaces` and your `remote_entry_url`. Then deploy a
version (registration alone leaves it at status `none`, so nothing renders).
For localhost testing the server needs the `NsUISDKDevRemotes` API config set
to `true`.

To remove a smiley, delete its `registerDynamicExtension` block in `src/App.tsx`.
