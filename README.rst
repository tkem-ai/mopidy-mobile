Mopidy Mobile
========================================================================

Mopidy Mobile is a simple, easy to use remote that lets you fully
control a Mopidy_ music server from your mobile device.  It is
available as a `Web client extension
<http://mopidy.readthedocs.org/en/latest/ext/web/>`_, which works
with current versions of all major mobile and desktop browsers.

In a nutshell, Mopidy Mobile lets you

- browse and search your entire Mopidy music library.
- search within selected directories only.
- edit the tracks in the current tracklist.
- create and edit playlists (requires Mopidy server v1.x).
- retrieve cover art from selected online resources.
- choose from multiple available user interface languages.


Installation
------------------------------------------------------------------------

The Web extension can be installed from PyPi_ by running::

  pip install Mopidy-Mobile

Note that the Web client is designed to be added to your home screen,
so it is launched in full-screen "app mode".  If you don't know how to
add a Web application to your home screen, there are plenty of
instructions available online for both `Android
<https://www.google.at/search?q=android+chrome+add+to+homescreen>`_
and `iOS
<https://www.google.at/search?q=ios+safari+add+to+homescreen>`_.


Configuration
------------------------------------------------------------------------

The following configuration values are available for the Web
extension:

- ``mobile/enabled``: Whether the extension should be enabled.
  Defaults to ``true``.

- ``mobile/title``: The Web application's title, which will also be
  displayed when added to your home screen.  The variables
  ``$hostname`` and ``$port`` can be used in the title.  Defaults to
  ``Mopidy Mobile on $hostname``.

- ``mobile/ws_url``: The WebSocket URL used to connect to your Mopidy
  server.  Set this if Mopidy's WebSocket is not available at its
  default path ``/mopidy/ws/``, for example when using a reverse
  proxy.


Building from Source
------------------------------------------------------------------------

Mopidy Mobile is built using `Ionic <https://ionicframework.com/>`_
and `Angular <https://angular.dev/>`_, so it is recommended to
familiarize yourself with these before you start.

To build the Mopidy Web extension, you need to have `Node.js
<https://nodejs.org/>`_ (version 20.19, 22.12 or later) and `npm
<https://www.npmjs.com/>`_ installed.  Then run::

  npm install
  npm run dist
  pip install --editable .

``npm run dist`` builds the application into the ``www`` directory,
and copies the result to ``mopidy_mobile/www`` for use by the Web
extension.  Use ``npm run lint`` to check the TypeScript sources and
templates, and ``npm run clean`` to remove all generated files.

``npm start`` runs a local development server at
http://localhost:4200/, which forwards Mopidy's WebSocket to a Mopidy
server running at http://localhost:6680.  To use another server, set
the ``MOPIDY_URL`` environment variable, for example::

  MOPIDY_URL=http://mopidy.local:6680 npm start

Unit tests are written with `Vitest <https://vitest.dev/>`_ and run
in a `jsdom <https://github.com/jsdom/jsdom>`_ environment via the
Angular CLI, so no browser is required.  Test files live next to the
sources as ``*.spec.ts``, with shared test helpers in ``src/testing``.
Run ``npm test`` to execute the test suite once, ``npm run test:watch``
to re-run tests on changes, and ``npm run test:coverage`` to produce a
code coverage report.


Contributing Translations
------------------------------------------------------------------------

If you'd like to see Mopidy Mobile in *your* native language, start by
having a look at the existing `translations <./src/app/locale>`_.
Mopidy Mobile uses `ICU MessageFormat
<https://messageformat.github.io/messageformat/guide/>`_ for
internationalization, and stores translations as simple text files.  Just take one of the
existing files and replace all foreign language text as you see fit.
Words within curly brackets ``{...}`` are placeholders, used either
for variable names (``{name}``) which needn't be translated, or for
pluralization (``{count, plural, one{1 Sekunde} other{# Sekunden}}``)
so you can provide different texts for zero (=0), one, or multiple
(``other``, with ``#`` being replaced by the actual number) seconds or
tracks.  When you're done, please open a new issue - or even a
full-fledged pull request, if you like - for submitting your
translations.


Project Resources
------------------------------------------------------------------------

.. image:: http://img.shields.io/pypi/v/Mopidy-Mobile.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-Mobile/
    :alt: Latest PyPI version

- `Issue Tracker`_
- `Source Code`_
- `Change Log`_


License
------------------------------------------------------------------------

Copyright (c) 2015-2025 Thomas Kemmer.

Translations: `slimer <https://github.com/slimer/>`_ (Español,
Català), `Andrzej Raczkowski <https://github.com/araczkowski/>`_
(Polski), `Peter Kuderjavy <mailto:kuderjavy@gmail.com>`_ (Slovak),
`Gilbert Brault <https://github.com/gbrault>`_ (Français),
`wimpie <https://github.com/70MM13>`_ (Nederlands),
`Tom Aurlund <mailto:tom.aurlund@gmail.com>`_ (Norsk Bokmål).

Licensed under the `Apache License, Version 2.0`_.


.. _Mopidy: http://www.mopidy.com/

.. _PyPI: https://pypi.python.org/pypi/Mopidy-Mobile/
.. _Issue Tracker: https://github.com/tkem/mopidy-mobile/issues/
.. _Source Code: https://github.com/tkem/mopidy-mobile/
.. _Change Log: https://github.com/tkem/mopidy-mobile/blob/master/CHANGELOG.rst

.. _Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
