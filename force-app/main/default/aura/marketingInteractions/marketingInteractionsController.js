({
	changeState : function changeState (component) { 
        component.set('v.isexpanded',!component.get('v.isexpanded'));
    },
    
    init: function (cmp) {
        var columns = [
            {
                type: 'text',
                fieldName: 'proposition',
                label: 'Proposition',
                initialWidth: 180
            },
            {
                type: 'number',
                fieldName: 'activityType',
                label: 'Activity Types'
            },
            {
                type: 'number',
                fieldName: 'totalCount',
                label: 'Total'
            },
            {
                type: 'number',
                fieldName: 'cumulativeCount',
                label: 'Cumulative',
            },
        ];

        cmp.set('v.gridColumns', columns);

        // data
        var nestedData = [
            {
                "name": "1",
                "proposition": "Holt Renfrew",
                "activityType": 4,
                "totalCount": "27",
                "cumulativeCount": "43",
                "_children": [
                    {
                        "name": "1-A",
                		"proposition": "New Arrivals",
                		"activityType": 3,
                		"totalCount": 5,
                		"cumulativeCount": 8,
                        "_children": [
                            {
                                "name": "1-A-A",
                                "proposition": "Women's Bestsellers",
                				"activityType": 2,
                				"totalCount": 4,
                				"cumulativeCount": 7,
                            },
                            {
                                "name": "1-A-B",
                                "proposition": "Men's Bestsellers",
                				"activityType": 1,
                				"totalCount": 1,
                				"cumulativeCount": 1,
                            }
                        ]
                    },

                    {
                        "name": "1-B",
                        "proposition": "Style Preference",
                				"activityType": 1,
                				"totalCount": 6,
                				"cumulativeCount": 7,
                        "_children": [
                            {
                                "name": "1-B-A",
                                "proposition": "Jackets",
                				"activityType": 1,
                				"totalCount": 5,
                				"cumulativeCount": 6,
    							"highlight": true,
    							"showClass": 'highlight'
                            },
                            {
                                "name": "1-B-B",
                                "proposition": "Tops",
                				"activityType": 1,
                				"totalCount": 1,
                				"cumulativeCount": 1,
                            },
                            {
                                "name": "1-B-B",
                                "proposition": "Bags",
                				"activityType": 1,
                				"totalCount": 1,
                				"cumulativeCount": 1,
                            }, 
                            {
                                "name": "1-B-B",
                                "proposition": "Accessories",
                				"activityType": 1,
                				"totalCount": 1,
                				"cumulativeCount": 1,
                            },
                            {
                                "name": "1-B-B",
                                "proposition": "Shoes",
                				"activityType": 1,
                				"totalCount": 1,
                				"cumulativeCount": 1,
                            }
                        ]
                    },

                {
                    "name": "123557",
                    "proposition": "Men's",
                    "activityType": 2,
                    "totalCount": 4,
                    "cumulativeCount": 6,
                    "_children": [
                        {
                            "name": "123557-A",
                            "proposition": "Shorts",
                            "activityType": 2,
                            "totalCount": 2,
                            "cumulativeCount": 3,
                        },
 						    {
                            "name": "123557-B",
                            "proposition": "Hoodies & Sweatshirts",
                            "activityType": 1,
                            "totalCount": 1,
                            "cumulativeCount": 2,
                        },
 						{
                            "name": "123557-C",
                            "proposition": "Accessories",
                            "activityType": 1,
                            "totalCount": 1,
                            "cumulativeCount": 1,
                        }
                    ]
                },
    
                {
                    "name": "123558",
                    "proposition": "H Project",
                    "activityType": 1,
                    "totalCount": 2,
                    "cumulativeCount": 3,
                    "_children": [
                        {
                            "name": "123558-A",
                            "proposition": "Sustainability",
                            "activityType": 1,
                            "totalCount": 1,
                            "cumulativeCount": 1,
                        },
                        {
                            "name": "123558-A",
                            "proposition": "Circle H",
                            "activityType": 1,
                            "totalCount": 1,
                            "cumulativeCount": 1,
                        }
                    ]
                }
        ]
 		}];

        cmp.set('v.gridData', nestedData);


        var expandedRows = ["1", "1-B"];

        cmp.set('v.gridExpandedRows', expandedRows);
    }
})