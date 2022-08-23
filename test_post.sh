type_value=$1
author_value=$2
time_value=$(date +%s)

echo "Sending POST request with data:"
echo "Type: $type_value"
echo "Author = $author_value"
echo "Time = $time_value"

curl -X POST localhost:8080 \
   -H 'Content-Type: application/json' \
   -d '{"type":"'$type_value'","time":"'$time_value'","author":"'$author_value'"}'
