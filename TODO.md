## 9/8

* Optionally configurable event category prefix
    - default "Trackomatic"
* Figure out a plan for testing
    - Mock dataLayer
    - Mock ga object
    - Outbound link clicks only on external links
        + Click on internal link
        + Click on external link
        + Send keyboard event
        + Send touch event
* Add Tests
* Add sampling + throttling to ErrorReportingPlugin
* Track data-attribute decorated links
    - data-trackomatic [any element]
        + case anchor
            * extract href
    - Ideal Scenario
        + data-trackomatic="<category>, optional <actionUrl>" 
        + (for non-anchor elements, specify actionUrl in data attribute)
        + ga(<category>, <inputMethod>, currentUrl)

* Road-map for future updates
    https://github.com/vigetlabs/trackomatic/issues
