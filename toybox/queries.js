//trying to save my ugly queris t make a stop object from the server side.

exports.trainstops = "

SELECT r.route_name route,
       st.route_id route_id,
       st.stoptime_stop_sequence seq,
      -- t.stop_sequence trip_seq,
       st.stoptime_id,
       s.stop_id,
       s.stop_name stop,
       st.stoptime_headsign goes_to,
       st.stoptime_arrival_time arrival,
       st.stoptime_departure_time depature,
       s.stop_lat latitude,
       s.stop_lon longitude
       --t.regular_stop regular_stop
  FROM stoptimes st
       INNER JOIN stops s
               ON st.stop_id = s.stop_id
                   
            	    AND
                 st.route_id = 506110 
                 AND
                 stoptime_trip = 6
                 
--       LEFT JOIN trips t
--               ON t.route_id = st.route_id 
--       INNER JOIN (SELECT * FROM trips t WHERE
--               -- t.stop_id = stoptimes.stop_id AND 
--                t.regular_stop = 1)

                  
       INNER JOIN routes r
               ON r.route_id = st.route_id;
" ;