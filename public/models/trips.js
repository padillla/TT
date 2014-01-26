//im testing functions in node so i need this as modules


var trips = [
    {
        "number": "1",
        "stop_id": 101090,
        "route_id": 506110,
        "stop_sequence": 1,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "2",
        "stop_id": 101091,
        "route_id": 506110,
        "stop_sequence": 2,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "3",
        "stop_id": 101095,
        "route_id": 506110,
        "stop_sequence": 3,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "4",
        "stop_id": 101092,
        "route_id": 506110,
        "stop_sequence": 4,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "5",
        "stop_id": 101093,
        "route_id": 506110,
        "stop_sequence": 5,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "6",
        "stop_id": 101094,
        "route_id": 506110,
        "stop_sequence": 6,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "7",
        "stop_id": 101081,
        "route_id": 506110,
        "stop_sequence": 7,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "8",
        "stop_id": 101080,
        "route_id": 506110,
        "stop_sequence": 8,
        "regular_stop": 1,
        "stoptimes": []
    }, {
        "number": "9",
        "stop_id": 101030,
        "route_id": 506110,
        "stop_sequence": 9,
        "regular_stop": 1,
        "stoptimes": []
    },  {
        "number": "10",
        "stop_id": 101031,
        "route_id": 506110,
        "stop_sequence": 10,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "11",
        "stop_id": 101040,
        "route_id": 506110,
        "stop_sequence": 11,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "12",
        "stop_id": 101041,
        "route_id": 506110,
        "stop_sequence": 12,
        "regular_stop": 1,
        "stoptimes": []
    },
 {
        "number": "13",
        "stop_id": 101010,
        "route_id": 506110,
        "stop_sequence": 13,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "14",
        "stop_id": 115050,
        "route_id": 506110,
        "stop_sequence": 14,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "15",
        "stop_id": 115051,
        "route_id": 506110,
        "stop_sequence": 15,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "16",
        "stop_id": 118010,
        "route_id": 506110,
        "stop_sequence": 16,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "17",
        "stop_id": 401010,
        "route_id": 506411,
        "stop_sequence": 1,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "18",
        "stop_id": 409020,
        "route_id": 506411,
        "stop_sequence": 2,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "19",
        "stop_id": 403060,
        "route_id": 506411,
        "stop_sequence": 3,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "20",
        "stop_id": 113050,
        "route_id": 506411,
        "stop_sequence": 4,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "21",
        "stop_id": 101010,
        "route_id": 506411,
        "stop_sequence": 5,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "22",
        "stop_id": 115050,
        "route_id": 506411,
        "stop_sequence": 6,
        "regular_stop": 0
    },
     {
        "number": "23",
        "stop_id": 115051,
        "route_id": 506411,
        "stop_sequence": 7,
        "regular_stop": 0
    },
     {
        "number": "24",
        "stop_id": 407010,
        "route_id": 506410,
        "stop_sequence": 1,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "25",
        "stop_id": 101091,
        "route_id": 506410,
        "stop_sequence": 2,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "26",
        "stop_id": 101093,
        "route_id": 506410,
        "stop_sequence": 3,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "27",
        "stop_id": 101080,
        "route_id": 506410,
        "stop_sequence": 4,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "28",
        "stop_id": 101031,
        "route_id": 506410,
        "stop_sequence": 5,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "29",
        "stop_id": 301020,
        "route_id": 506130,
        "stop_sequence": 1,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "30",
        "stop_id": 303060,
        "route_id": 506130,
        "stop_sequence": 2,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "31",
        "stop_id": 118011,
        "route_id": 506130,
        "stop_sequence": 3,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "32",
        "stop_id": 118010,
        "route_id": 506130,
        "stop_sequence": 4,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "33",
        "stop_id": 115051,
        "route_id": 506130,
        "stop_sequence": 5,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "34",
        "stop_id": 115050,
        "route_id": 506130,
        "stop_sequence": 6,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "35",
        "stop_id": 101010,
        "route_id": 506130,
        "stop_sequence": 7,
        "regular_stop": 1,
        "stoptimes": []
    },
     {
        "number": "36",
        "stop_id": 101041,
        "route_id": 506130,
        "stop_sequence": 8,
        "regular_stop": 0
    },
     {
        "number": "37",
        "stop_id": 101040,
        "route_id": 506130,
        "stop_sequence": 9,
        "regular_stop": 0
    },
     {
        "number": "38",
        "stop_id": 101031,
        "route_id": 506130,
        "stop_sequence": 10,
        "regular_stop": 0
    },
     {
        "number": "39",
        "stop_id": 101030,
        "route_id": 506130,
        "stop_sequence": 11,
        "regular_stop": 0
    },
     {
        "number": "40",
        "stop_id": 101080,
        "route_id": 506130,
        "stop_sequence": 12,
        "regular_stop": 0
    },
     {
        "number": "41",
        "stop_id": 101081,
        "route_id": 506130,
        "stop_sequence": 13,
        "regular_stop": 0
    },
     {
        "number": "42",
        "stop_id": 101094,
        "route_id": 506130,
        "stop_sequence": 14,
        "regular_stop": 0
    },
     {
        "number": "43",
        "stop_id": 101093,
        "route_id": 506130,
        "stop_sequence": 15,
        "regular_stop": 0
    },
     {
        "number": "44",
        "stop_id": 101092,
        "route_id": 506130,
        "stop_sequence": 16,
        "regular_stop": 0
    },
     {
        "number": "45",
        "stop_id": 101095,
        "route_id": 506130,
        "stop_sequence": 17,
        "regular_stop": 0
    },
     {
        "number": "46",
        "stop_id": 101091,
        "route_id": 506130,
        "stop_sequence": 18,
        "regular_stop": 0
    },
     {
        "number": "47",
        "stop_id": 101090,
        "route_id": 506130,
        "stop_sequence": 19,
        "regular_stop": 0
    }
];

module.exports = trips;