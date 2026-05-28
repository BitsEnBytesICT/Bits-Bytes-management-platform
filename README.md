# Bits-Bytes-management-platform
Dit project is het management platform voor bits&amp;bytes

# How to run
Er is een docker omgeving opgezet. run in de root folder `docker compose up`. Dit zou de frontend en backend moeten starten.

# How to test example route
1. `curl --header "Content-Type: application/json" --request PUT --data "{\"firstName\":\"test\",\"lastName\":\"test\",\"age\":\"30\",\"bday\":\"1-1-2000\"}" http://localhost:3000/users`
2. `curl --header "Content-Type: application/json" --request PUT --data "{\"firstName\":\"test\",\"lastName\":\"test\"}" http://localhost:3000/users`
3. `curl --header "Content-Type: application/json" --request PUT --data "{\"firstName\":\"test\"}" http://localhost:3000/users`
4. `curl --header "Content-Type: application/json" --request PUT --data "{\"lastName\":\"test\"}" http://localhost:3000/users`
5. `curl --header "Content-Type: application/json" --request PUT --data "{\"firstName\":\"test\",\"lastName\":\"test\",\"age\":\"-10\",\"bday\":\"20-20-2000\"}" http://localhost:3000/users`

# Main features
1. Beheren van deelnemers:
    Deelnemers kunnen toegevoegd worden in het syteem en in de servers
2. handtekeningen:
    De handtekeningen van de deelnemers worden aan hun account toegevoegd
    en zijn zichtbaar in een dashboard.
    Handtekeningen kunnen ook ge-exporteerd worden of handmatig toegevoegd worden
3. plattegrond en planning
    Er kan een plattegond planning gemaakt worden
    Aan deze plattegrond kan per werkplek ook extra informatie gekoppeld worden
4. Server beheer
    Gebruikers in de servers zijn gekoppeld aan de gebruikers van dit systeem
    promxox resources die zijn gekoppeld aan accounts kunnne beheerd worden
5. Inventarisatie
    De inventarisatie is gekoppeld aan dit project.
    Deelnemers kunnen ook inloggen op de inventarisatie
6. Kennisbank
    Er is ook een kennisbank wat deelnemers kunnen gebruiken als referencie
    ICT kan entries toevoegen om ook eigen referencie te hebben