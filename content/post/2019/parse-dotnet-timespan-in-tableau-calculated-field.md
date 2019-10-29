---
title: "Parse .NET TimeSpans in a Tableau Calculated Field"
url: 2019/parse-dotnet-timespans-in-a-tableau-calculated-field
date: 2019-10-28T23:03:55-05:00
tags:
- tableau
- csharp
- dotnet
- regex
---

Here's a formula you can use to create a calculated field in [Tableau](https://tableau.com) for converting strings in the format of .NET `TimeSpan` values to a total number of seconds.

Given a string `79.23:08:01.3976607` (79 days, 23 hours, 8 minutes, 1.3976607 seconds), it would return the total number of seconds.

```
IF ISNULL([TimeSpan]) THEN
   NULL
ELSE
   (IFNULL(INT(REGEXP_EXTRACT_NTH([TimeSpan], "^((\d+)\.)?(\d+):(\d+):(\d+(\.(\d+))?)$", 2)), 0) * 86400)
   + (INT(REGEXP_EXTRACT_NTH([TimeSpan], "^((\d+)\.)?(\d+):(\d+):(\d+(\.(\d+))?)$", 3)) * 3600)
   + (INT(REGEXP_EXTRACT_NTH([TimeSpan], "^((\d+)\.)?(\d+):(\d+):(\d+(\.(\d+))?)$", 4)) * 60)
   + FLOAT(REGEXP_EXTRACT_NTH([TimeSpan], "^((\d+)\.)?(\d+):(\d+):(\d+(\.(\d+))?)$", 5))
END
```