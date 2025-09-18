## ArcGIS Licensing

We are planning to integrate Esri’s ArcGIS SDK / Runtime / Maps services in the app. Below are considerations, risks, and what we need to decide to ensure we remain compliant.

### License Levels & Capabilities
Esri offers multiple production license levels: **Lite**, **Basic**, **Standard**, **Advanced**. Each level enables more features. For example, offline maps, premium basemaps, advanced spatial analysis may require Basic or above.

## Account's and Permissions
Licensing is tied to user types in ArcGIS Online or ArcGIS Enterprise. We’ll need to decide which user type(s) and permissions we need (e.g. “Creator”, “Mobile Worker”, etc.).  
For some features (premium data, extras) we may need “add-on” licenses or extensions.
https://www.esri.com/en-us/arcgis/products/arcgis-online/buy?rmedium=esri_com_regex&rsource=arcgis-online

### Cost & Term
Some licenses are subscription or annual-term licenses. They may need to be renewed.  
Extensions or premium data/services (if needed) may add extra cost.  
We should estimate usage (number of users, devices, offline vs online usage) to understand what license level is economical.


### Restrictions & Legal Obligations

Follow Esri’s Product-Specific Terms of Use / Master Agreement. Can’t reverse-engineer, must respect copyright notices.  
If we use any data or services with licensing / access limitations, ensure we have rights to use them (e.g. premium basemap, offline packages).  
If sharing or redistributing the app, ensure the license allows distribution on mobile platforms.

### Next Steps / Decisions Needed

1. Determine what features of ArcGIS we need (map display, offline maps, routing / analysis, etc.).  
2. Choose which license level (Lite / Basic / Standard / Advanced) is sufficient.  
3. Contact Esri to get pricing / license agreement for that level.  
4. Ensure one of our accounts (ArcGIS Online or Enterprise) has the required license and user type.  
5. Document which APIs / features we will use, so that we can identify which license levels / extensions apply.

https://www.esri.com/en-us/legal/overview