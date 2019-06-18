---
name: 'Bug report: Importing and Exporting'
about: Problems importing/exporting to third party software.
title: I submitted an issue without erasing the default title
labels: ''
assignees: ''

---

If you are a user having trouble with third party software importing PSDLE's list, contact the developer (and send them here).
If you are said developer, read on.
If you are neither, please erase this box and elaborate.

---

As of PSDLE version 3.3.13 (May 31st 2019) the export's configuration has been updated.
Prior versions were arrays with children containing the target property and column title as strings:

    ['prettyDate','Date'].

The children are now objects with property and title:

    {property:"prettyDate",title:"Date"}

All JSON exports will also now include a version property on the top level of PSDLE's version.
Regular/CSV exports will now include the same version number in the last row's last column (defined by separator).

These are intended to allow version-aware import handling in the event of futures changes, although it's highly recommended you and your users are always using the latest. For pre-3.3.13 handling, detect the absence of a version string or regular array children.
