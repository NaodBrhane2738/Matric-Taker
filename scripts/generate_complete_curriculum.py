import json
import os

def build_complete_ethiopian_curriculum():
    curriculum = {
        "schema_version": "1.0.0",
        "curriculum": {
            "id": "ethiopian-national-secondary-curriculum",
            "name": "Ethiopian Secondary Education Curriculum (Grades 9–12)",
            "country_code": "ET",
            "language": "en",
            "source_documents": [
                {
                    "id": "moe-ethiopia-curriculum-framework-2023",
                    "filename": "Ethiopian Ministry of Education National Curriculum Framework",
                    "grade": 12,
                    "subject_id": "general",
                    "document_type": "syllabus"
                }
            ],
            "grades": []
        }
    }

    # Grade 9
    g9_subjects = [
        {
            "id": "g09-biology",
            "name": "Biology",
            "order": 1,
            "review_status": "verified",
            "units": [
                {
                    "id": "g09-bio-u01", "number": "1", "title": "Unit 1: Biology and Technology", "order": 1, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-bio-u01-c01", "number": "1.1", "title": "1.1 Definition of Biology and Technology", "order": 1, "review_status": "verified", "subtopics": [{"id": "g09-bio-u01-c01-s01", "number": "1.1.1", "title": "Meaning and Branches of Biology", "order": 1, "review_status": "verified"}]},
                        {"id": "g09-bio-u01-c02", "number": "1.2", "title": "1.2 Scientific Method in Biological Research", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u01-c03", "number": "1.3", "title": "1.3 Tools and Techniques in Biology", "order": 3, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u01-c04", "number": "1.4", "title": "1.4 Relevance of Biology in Everyday Life", "order": 4, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-bio-u02", "number": "2", "title": "Unit 2: Characteristics of Living Things", "order": 2, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-bio-u02-c01", "number": "2.1", "title": "2.1 Life Processes and Cellular Organization", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u02-c02", "number": "2.2", "title": "2.2 Nutrition and Energy in Organisms", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u02-c03", "number": "2.3", "title": "2.3 Respiration, Excretion, and Homeostasis", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-bio-u03", "number": "3", "title": "Unit 3: Enzymes and Cellular Metabolism", "order": 3, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-bio-u03-c01", "number": "3.1", "title": "3.1 Nature and Properties of Enzymes", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u03-c02", "number": "3.2", "title": "3.2 Enzyme Specificity and Factors Affecting Rates", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u03-c03", "number": "3.3", "title": "3.3 Industrial and Medical Uses of Enzymes", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-bio-u04", "number": "4", "title": "Unit 4: Cell Biology and Genetics", "order": 4, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-bio-u04-c01", "number": "4.1", "title": "4.1 Cell Structure and Microscopy", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u04-c02", "number": "4.2", "title": "4.2 Cell Division (Mitosis and Meiosis)", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u04-c03", "number": "4.3", "title": "4.3 Basics of Heredity and Chromosomes", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-bio-u05", "number": "5", "title": "Unit 5: Human Biology and Health", "order": 5, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-bio-u05-c01", "number": "5.1", "title": "5.1 Digestive and Circulatory Systems", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u05-c02", "number": "5.2", "title": "5.2 Respiratory and Nervous Systems", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u05-c03", "number": "5.3", "title": "5.3 Infectious Diseases and Personal Hygiene", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-bio-u06", "number": "6", "title": "Unit 6: Ecology and Environmental Conservation", "order": 6, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-bio-u06-c01", "number": "6.1", "title": "6.1 Ecosystems, Biomes, and Energy Flow", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u06-c02", "number": "6.2", "title": "6.2 Biodiversity of Ethiopian Flora and Fauna", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-bio-u06-c03", "number": "6.3", "title": "6.3 Soil Conservation and Deforestation Control", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                }
            ]
        },
        {
            "id": "g09-chemistry",
            "name": "Chemistry",
            "order": 2,
            "review_status": "verified",
            "units": [
                {
                    "id": "g09-chem-u01", "number": "1", "title": "Unit 1: Chemistry and Its Importance", "order": 1, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-chem-u01-c01", "number": "1.1", "title": "1.1 Scope and Branches of Chemistry", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u01-c02", "number": "1.2", "title": "1.2 Role of Chemistry in Industry and Agriculture", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u01-c03", "number": "1.3", "title": "1.3 Chemical Safety and Laboratory Apparatus", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-chem-u02", "number": "2", "title": "Unit 2: Measurements and Scientific Notation", "order": 2, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-chem-u02-c01", "number": "2.1", "title": "2.1 SI Units and Metric Prefixes", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u02-c02", "number": "2.2", "title": "2.2 Significant Figures and Dimensional Analysis", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-chem-u03", "number": "3", "title": "Unit 3: Atomic Structure and the Periodic Table", "order": 3, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-chem-u03-c01", "number": "3.1", "title": "3.1 Subatomic Particles and Atomic Models", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u03-c02", "number": "3.2", "title": "3.2 Electronic Configuration and Orbitals", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u03-c03", "number": "3.3", "title": "3.3 Periodic Trends in the Modern Periodic Table", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-chem-u04", "number": "4", "title": "Unit 4: Chemical Bonding and Structure", "order": 4, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-chem-u04-c01", "number": "4.1", "title": "4.1 Ionic and Covalent Bonds", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u04-c02", "number": "4.2", "title": "4.2 Metallic Bonding and Intermolecular Forces", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-chem-u05", "number": "5", "title": "Unit 5: Physical States of Matter", "order": 5, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-chem-u05-c01", "number": "5.1", "title": "5.1 Kinetic Molecular Theory of Gases", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u05-c02", "number": "5.2", "title": "5.2 Gas Laws (Boyle, Charles, Avogadro)", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-chem-u05-c03", "number": "5.3", "title": "5.3 Liquids and Solids Phase Transitions", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                }
            ]
        },
        {
            "id": "g09-mathematics",
            "name": "Mathematics",
            "order": 3,
            "review_status": "verified",
            "units": [
                {
                    "id": "g09-math-u01", "number": "1", "title": "Unit 1: Further on Sets", "order": 1, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u01-c01", "number": "1.1", "title": "1.1 Operations on Sets and Venn Diagrams", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u01-c02", "number": "1.2", "title": "1.2 De Morgan's Laws and Applications", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-math-u02", "number": "2", "title": "Unit 2: The Number System", "order": 2, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u02-c01", "number": "2.1", "title": "2.1 Real Numbers and Rational Approximations", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u02-c02", "number": "2.2", "title": "2.2 Radicals and Exponents", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-math-u03", "number": "3", "title": "Unit 3: Linear Equations and Inequalities", "order": 3, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u03-c01", "number": "3.1", "title": "3.1 Solving Linear Equations in One Variable", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u03-c02", "number": "3.2", "title": "3.2 Systems of Linear Equations in Two Variables", "order": 2, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u03-c03", "number": "3.3", "title": "3.3 Linear Inequalities and Regions in the Plane", "order": 3, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-math-u04", "number": "4", "title": "Unit 4: Quadratic Equations and Functions", "order": 4, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u04-c01", "number": "4.1", "title": "4.1 Factoring and Quadratic Formula", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u04-c02", "number": "4.2", "title": "4.2 Parabola Graphs, Vertex, and Roots", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-math-u05", "number": "5", "title": "Unit 5: Geometry and Measurement", "order": 5, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u05-c01", "number": "5.1", "title": "5.1 Triangles, Congruence, and Similarity", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u05-c02", "number": "5.2", "title": "5.2 Perimeter, Area, and Volume of Prisms and Pyramids", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-math-u06", "number": "6", "title": "Unit 6: Introduction to Trigonometry", "order": 6, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u06-c01", "number": "6.1", "title": "6.1 Sine, Cosine, and Tangent Ratios", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u06-c02", "number": "6.2", "title": "6.2 Applications to Right-Angled Triangles", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-math-u07", "number": "7", "title": "Unit 7: Vectors in Two Dimensions", "order": 7, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u07-c01", "number": "7.1", "title": "7.1 Representation and Magnitude of 2D Vectors", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u07-c02", "number": "7.2", "title": "7.2 Vector Addition and Scalar Multiplication", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                },
                {
                    "id": "g09-math-u08", "number": "8", "title": "Unit 8: Statistics and Probability", "order": 8, "review_status": "verified",
                    "chapters": [
                        {"id": "g09-math-u08-c01", "number": "8.1", "title": "8.1 Frequency Tables, Histograms, and Mean/Median/Mode", "order": 1, "review_status": "verified", "subtopics": []},
                        {"id": "g09-math-u08-c02", "number": "8.2", "title": "8.2 Experimental and Theoretical Probability", "order": 2, "review_status": "verified", "subtopics": []}
                    ]
                }
            ]
        },
        {
            "id": "g09-physics",
            "name": "Physics",
            "order": 4,
            "review_status": "verified",
            "units": [
                {"id": "g09-phys-u01", "number": "1", "title": "Unit 1: Physics and Physical Measurement", "order": 1, "review_status": "verified", "chapters": [{"id": "g09-phys-u01-c01", "number": "1.1", "title": "1.1 Branches of Physics and SI Units", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u01-c02", "number": "1.2", "title": "1.2 Precision, Accuracy, and Uncertainties", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-phys-u02", "number": "2", "title": "Unit 2: Motion in One Dimension", "order": 2, "review_status": "verified", "chapters": [{"id": "g09-phys-u02-c01", "number": "2.1", "title": "2.1 Position, Distance, and Displacement", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u02-c02", "number": "2.2", "title": "2.2 Speed, Velocity, and Acceleration", "order": 2, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u02-c03", "number": "2.3", "title": "2.3 Equations of Uniformly Accelerated Motion", "order": 3, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-phys-u03", "number": "3", "title": "Unit 3: Force and Newton's Laws of Motion", "order": 3, "review_status": "verified", "chapters": [{"id": "g09-phys-u03-c01", "number": "3.1", "title": "3.1 Contact and Non-Contact Forces", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u03-c02", "number": "3.2", "title": "3.2 Newton's Three Laws of Motion", "order": 2, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u03-c03", "number": "3.3", "title": "3.3 Frictional Force and Coefficients", "order": 3, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-phys-u04", "number": "4", "title": "Unit 4: Work, Energy and Power", "order": 4, "review_status": "verified", "chapters": [{"id": "g09-phys-u04-c01", "number": "4.1", "title": "4.1 Work Done by Constant Forces", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u04-c02", "number": "4.2", "title": "4.2 Kinetic and Potential Energy", "order": 2, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u04-c03", "number": "4.3", "title": "4.3 Conservation of Mechanical Energy and Power", "order": 3, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-phys-u05", "number": "5", "title": "Unit 5: Simple Machines", "order": 5, "review_status": "verified", "chapters": [{"id": "g09-phys-u05-c01", "number": "5.1", "title": "5.1 Levers, Pulleys, and Inclined Planes", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u05-c02", "number": "5.2", "title": "5.2 Mechanical Advantage, Velocity Ratio, and Efficiency", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-phys-u06", "number": "6", "title": "Unit 6: Temperature and Heat", "order": 6, "review_status": "verified", "chapters": [{"id": "g09-phys-u06-c01", "number": "6.1", "title": "6.1 Thermometers and Temperature Scales", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u06-c02", "number": "6.2", "title": "6.2 Heat Transfer: Conduction, Convection, Radiation", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-phys-u07", "number": "7", "title": "Unit 7: Wave Motion and Sound", "order": 7, "review_status": "verified", "chapters": [{"id": "g09-phys-u07-c01", "number": "7.1", "title": "7.1 Longitudinal and Transverse Waves", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g09-phys-u07-c02", "number": "7.2", "title": "7.2 Pitch, Loudness, and Speed of Sound", "order": 2, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g09-english",
            "name": "English",
            "order": 5,
            "review_status": "verified",
            "units": [
                {"id": "g09-eng-u01", "number": "1", "title": "Unit 1: Living in Urban Areas", "order": 1, "review_status": "verified", "chapters": [{"id": "g09-eng-u01-c01", "number": "1.1", "title": "1.1 City Life, Reading, and Present Tenses", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u02", "number": "2", "title": "Unit 2: Study Skills", "order": 2, "review_status": "verified", "chapters": [{"id": "g09-eng-u02-c01", "number": "2.1", "title": "2.1 Note-Taking, Summarizing, and Organizing Ideas", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u03", "number": "3", "title": "Unit 3: Traffic Accidents", "order": 3, "review_status": "verified", "chapters": [{"id": "g09-eng-u03-c01", "number": "3.1", "title": "3.1 Road Safety Dialogue, Rules, and Vocabulary", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u04", "number": "4", "title": "Unit 4: National Parks", "order": 4, "review_status": "verified", "chapters": [{"id": "g09-eng-u04-c01", "number": "4.1", "title": "4.1 Wildlife Ecotourism and Gambella National Park", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u05", "number": "5", "title": "Unit 5: Horticulture", "order": 5, "review_status": "verified", "chapters": [{"id": "g09-eng-u05-c01", "number": "5.1", "title": "5.1 Plant Cultivation, Floriculture, and Economics", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u06", "number": "6", "title": "Unit 6: Poverty in Ethiopia", "order": 6, "review_status": "verified", "chapters": [{"id": "g09-eng-u06-c01", "number": "6.1", "title": "6.1 Social Challenges, Equity, and Persuasive Writing", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u07", "number": "7", "title": "Unit 7: Community Services", "order": 7, "review_status": "verified", "chapters": [{"id": "g09-eng-u07-c01", "number": "7.1", "title": "7.1 Volunteering and Civic Engagement", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u08", "number": "8", "title": "Unit 8: Communicable Diseases", "order": 8, "review_status": "verified", "chapters": [{"id": "g09-eng-u08-c01", "number": "8.1", "title": "8.1 Disease Prevention and Public Health Awareness", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u09", "number": "9", "title": "Unit 9: Traditional Culture", "order": 9, "review_status": "verified", "chapters": [{"id": "g09-eng-u09-c01", "number": "9.1", "title": "9.1 Cultural Heritage and Customs in Ethiopia", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-eng-u10", "number": "10", "title": "Unit 10: Digital Technology", "order": 10, "review_status": "verified", "chapters": [{"id": "g09-eng-u10-c01", "number": "10.1", "title": "10.1 Modern Communication and Digital Literacy", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g09-it",
            "name": "Information Technology",
            "order": 6,
            "review_status": "verified",
            "units": [
                {"id": "g09-it-u01", "number": "1", "title": "Unit 1: Introduction to Information Systems", "order": 1, "review_status": "verified", "chapters": [{"id": "g09-it-u01-c01", "number": "1.1", "title": "1.1 Definition and Components of Information Systems", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-it-u02", "number": "2", "title": "Unit 2: Computer Hardware and Software", "order": 2, "review_status": "verified", "chapters": [{"id": "g09-it-u02-c01", "number": "2.1", "title": "2.1 Input, Output, Storage, and System Software", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-it-u03", "number": "3", "title": "Unit 3: Word Processing and Spreadsheets", "order": 3, "review_status": "verified", "chapters": [{"id": "g09-it-u03-c01", "number": "3.1", "title": "3.1 Document Formatting and Spreadsheet Formulas", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-it-u04", "number": "4", "title": "Unit 4: Internet, Web, and Cyber Safety", "order": 4, "review_status": "verified", "chapters": [{"id": "g09-it-u04-c01", "number": "4.1", "title": "4.1 Search Engines, Safe Browsing, and Cyber Hygiene", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-it-u05", "number": "5", "title": "Unit 5: Introduction to Programming Concepts", "order": 5, "review_status": "verified", "chapters": [{"id": "g09-it-u05-c01", "number": "5.1", "title": "5.1 Algorithms, Flowcharts, and Problem Solving", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g09-it-u06", "number": "6", "title": "Unit 6: Societal Impact of IT", "order": 6, "review_status": "verified", "chapters": [{"id": "g09-it-u06-c01", "number": "6.1", "title": "6.1 Ethics, Digital Footprint, and ICT for Development", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        }
    ]

    # Grade 10
    g10_subjects = [
        {
            "id": "g10-biology",
            "name": "Biology",
            "order": 1,
            "review_status": "verified",
            "units": [
                {"id": "g10-bio-u01", "number": "1", "title": "Unit 1: Sub-disciplines of Biology", "order": 1, "review_status": "verified", "chapters": [{"id": "g10-bio-u01-c01", "number": "1.1", "title": "1.1 Fields of Biology and Career Pathways", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-bio-u02", "number": "2", "title": "Unit 2: Plants and Plant Physiology", "order": 2, "review_status": "verified", "chapters": [{"id": "g10-bio-u02-c01", "number": "2.1", "title": "2.1 Plant Tissues, Transport, and Photosynthesis", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-bio-u03", "number": "3", "title": "Unit 3: Biochemical Molecules", "order": 3, "review_status": "verified", "chapters": [{"id": "g10-bio-u03-c01", "number": "3.1", "title": "3.1 Carbohydrates, Lipids, Proteins, and Nucleic Acids", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-bio-u04", "number": "4", "title": "Unit 4: Cell Biology and Reproduction", "order": 4, "review_status": "verified", "chapters": [{"id": "g10-bio-u04-c01", "number": "4.1", "title": "4.1 Sexual and Asexual Reproduction in Organisms", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-bio-u05", "number": "5", "title": "Unit 5: Human Organ Systems", "order": 5, "review_status": "verified", "chapters": [{"id": "g10-bio-u05-c01", "number": "5.1", "title": "5.1 Skeletal, Muscular, and Endocrine Systems", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-bio-u06", "number": "6", "title": "Unit 6: Environment and Sustainable Development", "order": 6, "review_status": "verified", "chapters": [{"id": "g10-bio-u06-c01", "number": "6.1", "title": "6.1 Environmental Issues and Sustainable Resource Use", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g10-chemistry",
            "name": "Chemistry",
            "order": 2,
            "review_status": "verified",
            "units": [
                {"id": "g10-chem-u01", "number": "1", "title": "Unit 1: Chemical Reactions and Stoichiometry", "order": 1, "review_status": "verified", "chapters": [{"id": "g10-chem-u01-c01", "number": "1.1", "title": "1.1 Balancing Chemical Equations and Mole Concept", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-chem-u01-c02", "number": "1.2", "title": "1.2 Stoichiometric Calculations and Limiting Reactants", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-chem-u02", "number": "2", "title": "Unit 2: Solutions and Colloids", "order": 2, "review_status": "verified", "chapters": [{"id": "g10-chem-u02-c01", "number": "2.1", "title": "2.1 Concentration of Solutions (Molarity, Molality)", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-chem-u02-c02", "number": "2.2", "title": "2.2 Solubility Factors and Colligative Properties", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-chem-u03", "number": "3", "title": "Unit 3: Important Inorganic Compounds", "order": 3, "review_status": "verified", "chapters": [{"id": "g10-chem-u03-c01", "number": "3.1", "title": "3.1 Oxides, Acids, Bases, and Salts", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-chem-u03-c02", "number": "3.2", "title": "3.2 Industrial Production of Ammonia and Sulfuric Acid", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-chem-u04", "number": "4", "title": "Unit 4: Electrochemistry", "order": 4, "review_status": "verified", "chapters": [{"id": "g10-chem-u04-c01", "number": "4.1", "title": "4.1 Electrolytic Cells and Faraday's Laws", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-chem-u04-c02", "number": "4.2", "title": "4.2 Voltaic Cells and Corrosion Prevention", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-chem-u05", "number": "5", "title": "Unit 5: Introduction to Organic Chemistry", "order": 5, "review_status": "verified", "chapters": [{"id": "g10-chem-u05-c01", "number": "5.1", "title": "5.1 Hydrocarbons: Alkanes, Alkenes, Alkynes", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-chem-u05-c02", "number": "5.2", "title": "5.2 Alcohols, Carboxylic Acids, and Polymers", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-chem-u06", "number": "6", "title": "Unit 6: Chemistry in Agriculture and Industry", "order": 6, "review_status": "verified", "chapters": [{"id": "g10-chem-u06-c01", "number": "6.1", "title": "6.1 Fertilizers, Pesticides, and Soil Chemistry", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-chem-u07", "number": "7", "title": "Unit 7: Environmental Chemistry and Green Chemistry", "order": 7, "review_status": "verified", "chapters": [{"id": "g10-chem-u07-c01", "number": "7.1", "title": "7.1 Air and Water Pollution, Green Chemistry Principles", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g10-mathematics",
            "name": "Mathematics",
            "order": 3,
            "review_status": "verified",
            "units": [
                {"id": "g10-math-u01", "number": "1", "title": "Unit 1: Relations and Functions", "order": 1, "review_status": "verified", "chapters": [{"id": "g10-math-u01-c01", "number": "1.1", "title": "1.1 Inverses of Relations and Functions", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-math-u02", "number": "2", "title": "Unit 2: Polynomial Functions", "order": 2, "review_status": "verified", "chapters": [{"id": "g10-math-u02-c01", "number": "2.1", "title": "2.1 Division of Polynomials and Remainder Theorem", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-math-u02-c02", "number": "2.2", "title": "2.2 Graphs and Zeros of Polynomial Functions", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-math-u03", "number": "3", "title": "Unit 3: Exponential and Logarithmic Functions", "order": 3, "review_status": "verified", "chapters": [{"id": "g10-math-u03-c01", "number": "3.1", "title": "3.1 Laws of Exponents and Exponential Growth", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-math-u03-c02", "number": "3.2", "title": "3.2 Properties of Logarithms and Solving Equations", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-math-u04", "number": "4", "title": "Unit 4: Coordinate Geometry", "order": 4, "review_status": "verified", "chapters": [{"id": "g10-math-u04-c01", "number": "4.1", "title": "4.1 Distance, Midpoint, and Slope of Lines", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-math-u04-c02", "number": "4.2", "title": "4.2 Equations of Circles and Tangent Lines", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-math-u05", "number": "5", "title": "Unit 5: Trigonometric Functions", "order": 5, "review_status": "verified", "chapters": [{"id": "g10-math-u05-c01", "number": "5.1", "title": "5.1 Unit Circle and Radian Measure", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-math-u05-c02", "number": "5.2", "title": "5.2 Graphs of Sine, Cosine, and Tangent Functions", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-math-u06", "number": "6", "title": "Unit 6: Plane Geometry", "order": 6, "review_status": "verified", "chapters": [{"id": "g10-math-u06-c01", "number": "6.1", "title": "6.1 Circles, Chords, Secants, and Tangents", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-math-u07", "number": "7", "title": "Unit 7: Statistics and Probability", "order": 7, "review_status": "verified", "chapters": [{"id": "g10-math-u07-c01", "number": "7.1", "title": "7.1 Quartiles, Deciles, and Box Plots", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-math-u07-c02", "number": "7.2", "title": "7.2 Permutations, Combinations, and Compound Events", "order": 2, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g10-physics",
            "name": "Physics",
            "order": 4,
            "review_status": "verified",
            "units": [
                {"id": "g10-phys-u01", "number": "1", "title": "Unit 1: Thermodynamic Systems", "order": 1, "review_status": "verified", "chapters": [{"id": "g10-phys-u01-c01", "number": "1.1", "title": "1.1 First and Second Laws of Thermodynamics", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-phys-u02", "number": "2", "title": "Unit 2: Oscillations and Waves", "order": 2, "review_status": "verified", "chapters": [{"id": "g10-phys-u02-c01", "number": "2.1", "title": "2.1 Simple Harmonic Motion and Pendulums", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-phys-u02-c02", "number": "2.2", "title": "2.2 Wave Characteristics and Interference", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-phys-u03", "number": "3", "title": "Unit 3: Wave Optics", "order": 3, "review_status": "verified", "chapters": [{"id": "g10-phys-u03-c01", "number": "3.1", "title": "3.1 Reflection, Refraction, and Snell's Law", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g10-phys-u03-c02", "number": "3.2", "title": "3.2 Lenses, Mirrors, and Optical Instruments", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-phys-u04", "number": "4", "title": "Unit 4: Electrostatics", "order": 4, "review_status": "verified", "chapters": [{"id": "g10-phys-u04-c01", "number": "4.1", "title": "4.1 Electric Charges, Fields, and Potentials", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-phys-u05", "number": "5", "title": "Unit 5: Steady Electric Current and Circuit Elements", "order": 5, "review_status": "verified", "chapters": [{"id": "g10-phys-u05-c01", "number": "5.1", "title": "5.1 Resistors in Series and Parallel, Kirchhoff's Laws", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-phys-u06", "number": "6", "title": "Unit 6: Magnetism and Electromagnetism", "order": 6, "review_status": "verified", "chapters": [{"id": "g10-phys-u06-c01", "number": "6.1", "title": "6.1 Magnetic Fields, Force on Moving Charges, and Induction", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g10-english",
            "name": "English",
            "order": 5,
            "review_status": "verified",
            "units": [
                {"id": "g10-eng-u01", "number": "1", "title": "Unit 1: Population Growth", "order": 1, "review_status": "verified", "chapters": [{"id": "g10-eng-u01-c01", "number": "1.1", "title": "1.1 Population Dynamics and Vocabulary", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u02", "number": "2", "title": "Unit 2: Travel Behaviors", "order": 2, "review_status": "verified", "chapters": [{"id": "g10-eng-u02-c01", "number": "2.1", "title": "2.1 Tourism, Travel Logs, and Expressing Preferences", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u03", "number": "3", "title": "Unit 3: Punctuality", "order": 3, "review_status": "verified", "chapters": [{"id": "g10-eng-u03-c01", "number": "3.1", "title": "3.1 Time Management and Social Responsibilities", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u04", "number": "4", "title": "Unit 4: Tourist Attractions", "order": 4, "review_status": "verified", "chapters": [{"id": "g10-eng-u04-c01", "number": "4.1", "title": "4.1 Heritage Sites and Giving Directions", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u05", "number": "5", "title": "Unit 5: Honey Processing", "order": 5, "review_status": "verified", "chapters": [{"id": "g10-eng-u05-c01", "number": "5.1", "title": "5.1 Apiculture and Modern Agriculture in Ethiopia", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u06", "number": "6", "title": "Unit 6: Migration", "order": 6, "review_status": "verified", "chapters": [{"id": "g10-eng-u06-c01", "number": "6.1", "title": "6.1 Socioeconomic Impacts of Migration", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u07", "number": "7", "title": "Unit 7: Branding Ethiopia and National Identity", "order": 7, "review_status": "verified", "chapters": [{"id": "g10-eng-u07-c01", "number": "7.1", "title": "7.1 Cultural Assets and Country Branding", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u08", "number": "8", "title": "Unit 8: The Healing Power of Plants", "order": 8, "review_status": "verified", "chapters": [{"id": "g10-eng-u08-c01", "number": "8.1", "title": "8.1 Traditional Medicine and Pharmacology", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u09", "number": "9", "title": "Unit 9: Multilingualism", "order": 9, "review_status": "verified", "chapters": [{"id": "g10-eng-u09-c01", "number": "9.1", "title": "9.1 Linguistic Diversity and Social Cohesion", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-eng-u10", "number": "10", "title": "Unit 10: Digital vs. Satellite Television", "order": 10, "review_status": "verified", "chapters": [{"id": "g10-eng-u10-c01", "number": "10.1", "title": "10.1 Contemporary Media and Broadcasting Tech", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g10-it",
            "name": "Information Technology",
            "order": 6,
            "review_status": "verified",
            "units": [
                {"id": "g10-it-u01", "number": "1", "title": "Unit 1: Computer Networks and the Internet", "order": 1, "review_status": "verified", "chapters": [{"id": "g10-it-u01-c01", "number": "1.1", "title": "1.1 Network Topologies, Protocols, and Hardware", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-it-u02", "number": "2", "title": "Unit 2: Information Security and Privacy", "order": 2, "review_status": "verified", "chapters": [{"id": "g10-it-u02-c01", "number": "2.1", "title": "2.1 Malware, Encryption, and Access Controls", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-it-u03", "number": "3", "title": "Unit 3: Database Concepts and SQL", "order": 3, "review_status": "verified", "chapters": [{"id": "g10-it-u03-c01", "number": "3.1", "title": "3.1 Tables, Keys, and Basic SQL Queries", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-it-u04", "number": "4", "title": "Unit 4: Web Design and Publishing", "order": 4, "review_status": "verified", "chapters": [{"id": "g10-it-u04-c01", "number": "4.1", "title": "4.1 HTML Structures and CSS Styling", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-it-u05", "number": "5", "title": "Unit 5: Programming in Python", "order": 5, "review_status": "verified", "chapters": [{"id": "g10-it-u05-c01", "number": "5.1", "title": "5.1 Variables, Control Structures, and Loops", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g10-it-u06", "number": "6", "title": "Unit 6: Emerging Technologies and Careers in IT", "order": 6, "review_status": "verified", "chapters": [{"id": "g10-it-u06-c01", "number": "6.1", "title": "6.1 Cloud Computing, AI Basics, and Career Paths", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        }
    ]

    # Grade 11
    g11_subjects = [
        {
            "id": "g11-biology",
            "name": "Biology",
            "order": 1,
            "review_status": "verified",
            "units": [
                {"id": "g11-bio-u01", "number": "1", "title": "Unit 1: Biology and Technology", "order": 1, "review_status": "verified", "chapters": [{"id": "g11-bio-u01-c01", "number": "1.1", "title": "1.1 Learning from Nature (Biomimicry)", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u01-c02", "number": "1.2", "title": "1.2 Interdependence of Biology and Technology", "order": 2, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u01-c03", "number": "1.3", "title": "1.3 Ethical Issues in Biological Research", "order": 3, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-bio-u02", "number": "2", "title": "Unit 2: Characteristics of Animals", "order": 2, "review_status": "verified", "chapters": [{"id": "g11-bio-u02-c01", "number": "2.1", "title": "2.1 Classification of Invertebrates and Vertebrates", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u02-c02", "number": "2.2", "title": "2.2 Anatomical and Physiological Adaptations", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-bio-u03", "number": "3", "title": "Unit 3: Enzymes", "order": 3, "review_status": "verified", "chapters": [{"id": "g11-bio-u03-c01", "number": "3.1", "title": "3.1 Nature, Structure, and Mechanism of Enzymes", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u03-c02", "number": "3.2", "title": "3.2 Factors Affecting Enzyme Activity and Inhibition", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-bio-u04", "number": "4", "title": "Unit 4: Genetics", "order": 4, "review_status": "verified", "chapters": [{"id": "g11-bio-u04-c01", "number": "4.1", "title": "4.1 Mendelian Principles and Genetic Crosses", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u04-c02", "number": "4.2", "title": "4.2 DNA Replication, Transcription, and Translation", "order": 2, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u04-c03", "number": "4.3", "title": "4.3 Genetic Engineering and Biotechnology", "order": 3, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-bio-u05", "number": "5", "title": "Unit 5: The Human Body Systems", "order": 5, "review_status": "verified", "chapters": [{"id": "g11-bio-u05-c01", "number": "5.1", "title": "5.1 Interdependent Human Body Systems", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u05-c02", "number": "5.2", "title": "5.2 Homeostatic Regulation and Physiology", "order": 2, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u05-c03", "number": "5.3", "title": "5.3 Health Impacts of Substance Abuse (Khat, Alcohol)", "order": 3, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-bio-u06", "number": "6", "title": "Unit 6: Population and Natural Resources", "order": 6, "review_status": "verified", "chapters": [{"id": "g11-bio-u06-c01", "number": "6.1", "title": "6.1 Population Dynamics and Environmental Limits", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u06-c02", "number": "6.2", "title": "6.2 Sustainable Management of Natural Resources", "order": 2, "review_status": "verified", "subtopics": []}, {"id": "g11-bio-u06-c03", "number": "6.3", "title": "6.3 Indigenous Conservation Practices in Ethiopia", "order": 3, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g11-chemistry",
            "name": "Chemistry",
            "order": 2,
            "review_status": "verified",
            "units": [
                {"id": "g11-chem-u01", "number": "1", "title": "Unit 1: Atomic Structure and Periodicity", "order": 1, "review_status": "verified", "chapters": [{"id": "g11-chem-u01-c01", "number": "1.1", "title": "1.1 Quantum Mechanical Model of the Atom", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-chem-u01-c02", "number": "1.2", "title": "1.2 Periodic Trends in Atomic and Ionic Properties", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-chem-u02", "number": "2", "title": "Unit 2: Chemical Bonding and Intermolecular Forces", "order": 2, "review_status": "verified", "chapters": [{"id": "g11-chem-u02-c01", "number": "2.1", "title": "2.1 Valence Bond Theory and Hybridization", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-chem-u02-c02", "number": "2.2", "title": "2.2 Molecular Orbital Theory and VSEPR Geometries", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-chem-u03", "number": "3", "title": "Unit 3: Physical States of Matter", "order": 3, "review_status": "verified", "chapters": [{"id": "g11-chem-u03-c01", "number": "3.1", "title": "3.1 Real Gases and van der Waals Equation", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-chem-u03-c02", "number": "3.2", "title": "3.2 Liquid State Properties and Crystal Lattices", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-chem-u04", "number": "4", "title": "Unit 4: Chemical Kinetics", "order": 4, "review_status": "verified", "chapters": [{"id": "g11-chem-u04-c01", "number": "4.1", "title": "4.1 Reaction Rates and Rate Laws", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-chem-u04-c02", "number": "4.2", "title": "4.2 Collision Theory and Activation Energy (Arrhenius)", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-chem-u05", "number": "5", "title": "Unit 5: Chemical Equilibrium", "order": 5, "review_status": "verified", "chapters": [{"id": "g11-chem-u05-c01", "number": "5.1", "title": "5.1 Equilibrium Constant (Kc, Kp) and Le Chatelier's Principle", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-chem-u06", "number": "6", "title": "Unit 6: Some Important Non-Metals and Their Compounds", "order": 6, "review_status": "verified", "chapters": [{"id": "g11-chem-u06-c01", "number": "6.1", "title": "6.1 Nitrogen, Phosphorus, Oxygen, and Sulfur Chemistry", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g11-mathematics",
            "name": "Mathematics",
            "order": 3,
            "review_status": "verified",
            "units": [
                {"id": "g11-math-u01", "number": "1", "title": "Unit 1: Relations and Functions", "order": 1, "review_status": "verified", "chapters": [{"id": "g11-math-u01-c01", "number": "1.1", "title": "1.1 Domain, Range, and Composition of Functions", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-math-u02", "number": "2", "title": "Unit 2: Rational Expressions and Rational Functions", "order": 2, "review_status": "verified", "chapters": [{"id": "g11-math-u02-c01", "number": "2.1", "title": "2.1 Simplifying Rational Expressions and Operations", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-math-u02-c02", "number": "2.2", "title": "2.2 Graphing Rational Functions and Asymptotes", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-math-u03", "number": "3", "title": "Unit 3: Matrices", "order": 3, "review_status": "verified", "chapters": [{"id": "g11-math-u03-c01", "number": "3.1", "title": "3.1 Matrix Arithmetic and Systems of Equations", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-math-u04", "number": "4", "title": "Unit 4: Determinants and Their Properties", "order": 4, "review_status": "verified", "chapters": [{"id": "g11-math-u04-c01", "number": "4.1", "title": "4.1 Determinant Computation and Cramer's Rule", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-math-u05", "number": "5", "title": "Unit 5: Vectors", "order": 5, "review_status": "verified", "chapters": [{"id": "g11-math-u05-c01", "number": "5.1", "title": "5.1 Vector Operations and Dot Product in Plane", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-math-u06", "number": "6", "title": "Unit 6: Transformations of the Plane", "order": 6, "review_status": "verified", "chapters": [{"id": "g11-math-u06-c01", "number": "6.1", "title": "6.1 Translations, Rotations, Reflections, Dilations", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-math-u07", "number": "7", "title": "Unit 7: Statistics", "order": 7, "review_status": "verified", "chapters": [{"id": "g11-math-u07-c01", "number": "7.1", "title": "7.1 Variance, Standard Deviation, and Grouped Data", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-math-u08", "number": "8", "title": "Unit 8: Probability", "order": 8, "review_status": "verified", "chapters": [{"id": "g11-math-u08-c01", "number": "8.1", "title": "8.1 Counting Rules and Conditional Probability", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g11-physics",
            "name": "Physics",
            "order": 4,
            "review_status": "verified",
            "units": [
                {"id": "g11-phys-u01", "number": "1", "title": "Unit 1: Physics and Human Society", "order": 1, "review_status": "verified", "chapters": [{"id": "g11-phys-u01-c01", "number": "1.1", "title": "1.1 Influence of Physics on Society and Technology", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-phys-u02", "number": "2", "title": "Unit 2: Vectors", "order": 2, "review_status": "verified", "chapters": [{"id": "g11-phys-u02-c01", "number": "2.1", "title": "2.1 Vector Algebra, Unit Vectors, and Vector Products", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-phys-u03", "number": "3", "title": "Unit 3: Motion in One and Two Dimensions", "order": 3, "review_status": "verified", "chapters": [{"id": "g11-phys-u03-c01", "number": "3.1", "title": "3.1 Projectile Motion and Trajectory Analysis", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-phys-u03-c02", "number": "3.2", "title": "3.2 Relative Velocity and Uniform Circular Motion", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-phys-u04", "number": "4", "title": "Unit 4: Dynamics", "order": 4, "review_status": "verified", "chapters": [{"id": "g11-phys-u04-c01", "number": "4.1", "title": "4.1 Newton's Laws Applied to Connected Systems", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g11-phys-u04-c02", "number": "4.2", "title": "4.2 Work-Energy Theorem and Momentum Conservation", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-phys-u05", "number": "5", "title": "Unit 5: Heat Conduction and Calorimetry", "order": 5, "review_status": "verified", "chapters": [{"id": "g11-phys-u05-c01", "number": "5.1", "title": "5.1 Thermal Conduction, Fourier's Law, and Heat Capacity", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-phys-u06", "number": "6", "title": "Unit 6: Electrostatics and Electric Circuit", "order": 6, "review_status": "verified", "chapters": [{"id": "g11-phys-u06-c01", "number": "6.1", "title": "6.1 Gauss's Law, Capacitance, and DC Circuit Analysis", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-phys-u07", "number": "7", "title": "Unit 7: Nuclear Physics", "order": 7, "review_status": "verified", "chapters": [{"id": "g11-phys-u07-c01", "number": "7.1", "title": "7.1 Radioactivity, Binding Energy, Fission, and Fusion", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g11-english",
            "name": "English",
            "order": 5,
            "review_status": "verified",
            "units": [
                {"id": "g11-eng-u01", "number": "1", "title": "Unit 1: Environmental Hazards", "order": 1, "review_status": "verified", "chapters": [{"id": "g11-eng-u01-c01", "number": "1.1", "title": "1.1 Environmental Hazards and Crisis Vocabulary", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u02", "number": "2", "title": "Unit 2: Civilization", "order": 2, "review_status": "verified", "chapters": [{"id": "g11-eng-u02-c01", "number": "2.1", "title": "2.1 World Civilizations and Ancient Ethiopian History", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u03", "number": "3", "title": "Unit 3: Causes of Road Traffic Accidents", "order": 3, "review_status": "verified", "chapters": [{"id": "g11-eng-u03-c01", "number": "3.1", "title": "3.1 Accident Investigation and Preventative Measures", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u04", "number": "4", "title": "Unit 4: People and Natural Resources", "order": 4, "review_status": "verified", "chapters": [{"id": "g11-eng-u04-c01", "number": "4.1", "title": "4.1 Environmental Sustainability and Resource Depletion", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u05", "number": "5", "title": "Unit 5: Irrigation", "order": 5, "review_status": "verified", "chapters": [{"id": "g11-eng-u05-c01", "number": "5.1", "title": "5.1 Agricultural Water Management and Food Security", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u06", "number": "6", "title": "Unit 6: Global Warming", "order": 6, "review_status": "verified", "chapters": [{"id": "g11-eng-u06-c01", "number": "6.1", "title": "6.1 Climate Change, Scientific Literacy, and Debates", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u07", "number": "7", "title": "Unit 7: Patriotism", "order": 7, "review_status": "verified", "chapters": [{"id": "g11-eng-u07-c01", "number": "7.1", "title": "7.1 Civic Pride, National Unity, and Public Service", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u08", "number": "8", "title": "Unit 8: Efficiency of Health Services", "order": 8, "review_status": "verified", "chapters": [{"id": "g11-eng-u08-c01", "number": "8.1", "title": "8.1 Healthcare Delivery and Community Wellbeing", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u09", "number": "9", "title": "Unit 9: Indigenous Conflict Resolution", "order": 9, "review_status": "verified", "chapters": [{"id": "g11-eng-u09-c01", "number": "9.1", "title": "9.1 Traditional Justice Mechanisms (Shimagille, Gadaa)", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-eng-u10", "number": "10", "title": "Unit 10: Artificial Intelligence", "order": 10, "review_status": "verified", "chapters": [{"id": "g11-eng-u10-c01", "number": "10.1", "title": "10.1 AI Frontiers, Automation, and Ethical Futures", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g11-it",
            "name": "Information Technology",
            "order": 6,
            "review_status": "verified",
            "units": [
                {"id": "g11-it-u01", "number": "1", "title": "Unit 1: Information Systems and Its Applications", "order": 1, "review_status": "verified", "chapters": [{"id": "g11-it-u01-c01", "number": "1.1", "title": "1.1 DIKW Hierarchy and E-Government Systems", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-it-u02", "number": "2", "title": "Unit 2: Emerging Technologies", "order": 2, "review_status": "verified", "chapters": [{"id": "g11-it-u02-c01", "number": "2.1", "title": "2.1 Artificial Intelligence, AR/VR, and Data Science", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-it-u03", "number": "3", "title": "Unit 3: Database Management", "order": 3, "review_status": "verified", "chapters": [{"id": "g11-it-u03-c01", "number": "3.1", "title": "3.1 Relational Models, Entities, and Relationships", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-it-u04", "number": "4", "title": "Unit 4: Web Development", "order": 4, "review_status": "verified", "chapters": [{"id": "g11-it-u04-c01", "number": "4.1", "title": "4.1 HTML5 Semantic Elements, Tables, and Forms", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-it-u05", "number": "5", "title": "Unit 5: Hardware Troubleshooting and Maintenance", "order": 5, "review_status": "verified", "chapters": [{"id": "g11-it-u05-c01", "number": "5.1", "title": "5.1 Diagnostic Procedures and Preventive Maintenance", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g11-it-u06", "number": "6", "title": "Unit 6: Fundamentals of Programming", "order": 6, "review_status": "verified", "chapters": [{"id": "g11-it-u06-c01", "number": "6.1", "title": "6.1 Python Syntax, Functions, and Data Structures", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        }
    ]

    # Grade 12 (National Examination Grade)
    g12_subjects = [
        {
            "id": "g12-biology",
            "name": "Biology",
            "order": 1,
            "review_status": "verified",
            "units": [
                {"id": "g12-bio-u01", "number": "1", "title": "Unit 1: Application of Biology", "order": 1, "review_status": "verified", "chapters": [{"id": "g12-bio-u01-c01", "number": "1.1", "title": "1.1 Branches and Modern Applications of Biology", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-bio-u01-c02", "number": "1.2", "title": "1.2 Conservation Biology in Ethiopia", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-bio-u02", "number": "2", "title": "Unit 2: Microorganisms", "order": 2, "review_status": "verified", "chapters": [{"id": "g12-bio-u02-c01", "number": "2.1", "title": "2.1 Diversity and Structure of Microbes", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-bio-u02-c02", "number": "2.2", "title": "2.2 Pathogenic Microorganisms and Immunology", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-bio-u03", "number": "3", "title": "Unit 3: Energy Transformation", "order": 3, "review_status": "verified", "chapters": [{"id": "g12-bio-u03-c01", "number": "3.1", "title": "3.1 Thermodynamics and Cellular Respiration", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-bio-u03-c02", "number": "3.2", "title": "3.2 Photosynthesis and Energy Flow", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-bio-u04", "number": "4", "title": "Unit 4: Evolution", "order": 4, "review_status": "verified", "chapters": [{"id": "g12-bio-u04-c01", "number": "4.1", "title": "4.1 Origin of Life and Evidence for Evolution", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-bio-u04-c02", "number": "4.2", "title": "4.2 Mechanisms of Natural Selection and Speciation", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-bio-u05", "number": "5", "title": "Unit 5: Human Body System", "order": 5, "review_status": "verified", "chapters": [{"id": "g12-bio-u05-c01", "number": "5.1", "title": "5.1 Nervous System, Sensory Organs, and Homeostasis", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-bio-u06", "number": "6", "title": "Unit 6: Climate Change", "order": 6, "review_status": "verified", "chapters": [{"id": "g12-bio-u06-c01", "number": "6.1", "title": "6.1 Greenhouse Effect, Biodiversity Loss, and Climate Adaptation", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g12-chemistry",
            "name": "Chemistry",
            "order": 2,
            "review_status": "verified",
            "units": [
                {"id": "g12-chem-u01", "number": "1", "title": "Unit 1: Acid-Base Equilibria", "order": 1, "review_status": "verified", "chapters": [{"id": "g12-chem-u01-c01", "number": "1.1", "title": "1.1 Arrhenius, Bronsted-Lowry, Lewis Theories and pH", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-chem-u01-c02", "number": "1.2", "title": "1.2 Buffer Solutions and Acid-Base Titration Curves", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-chem-u02", "number": "2", "title": "Unit 2: Electrochemistry and Redox Reactions", "order": 2, "review_status": "verified", "chapters": [{"id": "g12-chem-u02-c01", "number": "2.1", "title": "2.1 Nernst Equation and Standard Reduction Potentials", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-chem-u02-c02", "number": "2.2", "title": "2.2 Commercial Batteries, Fuel Cells, and Electrolysis", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-chem-u03", "number": "3", "title": "Unit 3: Industrial Chemistry", "order": 3, "review_status": "verified", "chapters": [{"id": "g12-chem-u03-c01", "number": "3.1", "title": "3.1 Metallurgy, Cement, Sugar, and Petroleum Refining", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-chem-u04", "number": "4", "title": "Unit 4: Polymers and Macromolecules", "order": 4, "review_status": "verified", "chapters": [{"id": "g12-chem-u04-c01", "number": "4.1", "title": "4.1 Addition and Condensation Polymerization", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-chem-u05", "number": "5", "title": "Unit 5: Introduction to Environmental Chemistry", "order": 5, "review_status": "verified", "chapters": [{"id": "g12-chem-u05-c01", "number": "5.1", "title": "5.1 Atmospheric Chemistry and Hazardous Waste Management", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-chem-u06", "number": "6", "title": "Unit 6: Organic Chemistry II", "order": 6, "review_status": "verified", "chapters": [{"id": "g12-chem-u06-c01", "number": "6.1", "title": "6.1 Aldehydes, Ketones, Carboxylic Acids, and Esters", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g12-mathematics",
            "name": "Mathematics",
            "order": 3,
            "review_status": "verified",
            "units": [
                {"id": "g12-math-u01", "number": "1", "title": "Unit 1: Sequence and Series", "order": 1, "review_status": "verified", "chapters": [{"id": "g12-math-u01-c01", "number": "1.1", "title": "1.1 Arithmetic and Geometric Sequences", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-math-u01-c02", "number": "1.2", "title": "1.2 Infinite Series, Convergence, and Sigma Notation", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-math-u02", "number": "2", "title": "Unit 2: Introduction to Limits and Continuity", "order": 2, "review_status": "verified", "chapters": [{"id": "g12-math-u02-c01", "number": "2.1", "title": "2.1 Limits of Sequences and Functions", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-math-u02-c02", "number": "2.2", "title": "2.2 Continuity, One-Sided Limits, and Intermediate Value Theorem", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-math-u03", "number": "3", "title": "Unit 3: Introduction to Differential Calculus", "order": 3, "review_status": "verified", "chapters": [{"id": "g12-math-u03-c01", "number": "3.1", "title": "3.1 Derivatives from First Principles and Power Rule", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-math-u03-c02", "number": "3.2", "title": "3.2 Product, Quotient, and Chain Rules", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-math-u04", "number": "4", "title": "Unit 4: Applications of Differential Calculus", "order": 4, "review_status": "verified", "chapters": [{"id": "g12-math-u04-c01", "number": "4.1", "title": "4.1 Extrema, Curve Sketching, and Optimization", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-math-u04-c02", "number": "4.2", "title": "4.2 Related Rates of Change and Tangent Lines", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-math-u05", "number": "5", "title": "Unit 5: Introduction to Integral Calculus", "order": 5, "review_status": "verified", "chapters": [{"id": "g12-math-u05-c01", "number": "5.1", "title": "5.1 Indefinite Integrals and Substitution Method", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-math-u05-c02", "number": "5.2", "title": "5.2 Definite Integrals and Area under Curves", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-math-u06", "number": "6", "title": "Unit 6: 3D Geometry and Vectors in Space", "order": 6, "review_status": "verified", "chapters": [{"id": "g12-math-u06-c01", "number": "6.1", "title": "6.1 Coordinates in Space, Lines, and Planes", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-math-u06-c02", "number": "6.2", "title": "6.2 Cross Product and Vector Projections", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-math-u07", "number": "7", "title": "Unit 7: Logic and Mathematical Proofs", "order": 7, "review_status": "verified", "chapters": [{"id": "g12-math-u07-c01", "number": "7.1", "title": "7.1 Propositions, Truth Tables, and Predicate Calculus", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-math-u07-c02", "number": "7.2", "title": "7.2 Direct, Contradiction, and Induction Proofs", "order": 2, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g12-physics",
            "name": "Physics",
            "order": 4,
            "review_status": "verified",
            "units": [
                {"id": "g12-phys-u01", "number": "1", "title": "Unit 1: Thermodynamics", "order": 1, "review_status": "verified", "chapters": [{"id": "g12-phys-u01-c01", "number": "1.1", "title": "1.1 Heat Engines, Carnot Cycle, and Entropy", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-phys-u02", "number": "2", "title": "Unit 2: Oscillations and Wave Optics", "order": 2, "review_status": "verified", "chapters": [{"id": "g12-phys-u02-c01", "number": "2.1", "title": "2.1 Damped and Driven Oscillations, Resonance", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-phys-u02-c02", "number": "2.2", "title": "2.2 Interference, Diffraction Grating, and Polarization", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-phys-u03", "number": "3", "title": "Unit 3: Electromagnetism", "order": 3, "review_status": "verified", "chapters": [{"id": "g12-phys-u03-c01", "number": "3.1", "title": "3.1 Biot-Savart Law and Ampere's Law", "order": 1, "review_status": "verified", "subtopics": []}, {"id": "g12-phys-u03-c02", "number": "3.2", "title": "3.2 Faraday's Law, Lenz's Law, and AC Generators", "order": 2, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-phys-u04", "number": "4", "title": "Unit 4: Alternating Current Circuits", "order": 4, "review_status": "verified", "chapters": [{"id": "g12-phys-u04-c01", "number": "4.1", "title": "4.1 RLC Series Circuits, Impedance, and Power Factor", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-phys-u05", "number": "5", "title": "Unit 5: Modern Physics and Quantum Theory", "order": 5, "review_status": "verified", "chapters": [{"id": "g12-phys-u05-c01", "number": "5.1", "title": "5.1 Photoelectric Effect, Compton Scattering, and De Broglie Wavelength", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-phys-u06", "number": "6", "title": "Unit 6: Nuclear Reactions and Particle Physics", "order": 6, "review_status": "verified", "chapters": [{"id": "g12-phys-u06-c01", "number": "6.1", "title": "6.1 Nuclear Binding Energy, Fission, Fusion, and Fundamental Particles", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g12-english",
            "name": "English",
            "order": 5,
            "review_status": "verified",
            "units": [
                {"id": "g12-eng-u01", "number": "1", "title": "Unit 1: Academic Reading and Note Taking", "order": 1, "review_status": "verified", "chapters": [{"id": "g12-eng-u01-c01", "number": "1.1", "title": "1.1 Critical Reading and Academic Synthesis", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u02", "number": "2", "title": "Unit 2: Critical Thinking and Argumentation", "order": 2, "review_status": "verified", "chapters": [{"id": "g12-eng-u02-c01", "number": "2.1", "title": "2.1 Logical Fallacies and Structured Debates", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u03", "number": "3", "title": "Unit 3: Science and Discovery", "order": 3, "review_status": "verified", "chapters": [{"id": "g12-eng-u03-c01", "number": "3.1", "title": "3.1 Scientific Reports and Passive Voice", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u04", "number": "4", "title": "Unit 4: Media and Communication", "order": 4, "review_status": "verified", "chapters": [{"id": "g12-eng-u04-c01", "number": "4.1", "title": "4.1 Journalism, Bias, and Information Evaluation", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u05", "number": "5", "title": "Unit 5: Cultural Heritage", "order": 5, "review_status": "verified", "chapters": [{"id": "g12-eng-u05-c01", "number": "5.1", "title": "5.1 UNESCO Sites and Cultural Narratives", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u06", "number": "6", "title": "Unit 6: Environment and Sustainability", "order": 6, "review_status": "verified", "chapters": [{"id": "g12-eng-u06-c01", "number": "6.1", "title": "6.1 Global Ecological Literacy and Essay Writing", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u07", "number": "7", "title": "Unit 7: Innovation and Entrepreneurship", "order": 7, "review_status": "verified", "chapters": [{"id": "g12-eng-u07-c01", "number": "7.1", "title": "7.1 Business Proposals and Formal Presentations", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u08", "number": "8", "title": "Unit 8: Global Citizenship", "order": 8, "review_status": "verified", "chapters": [{"id": "g12-eng-u08-c01", "number": "8.1", "title": "8.1 International Diplomacy and Human Rights", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u09", "number": "9", "title": "Unit 9: Career Planning and Leadership", "order": 9, "review_status": "verified", "chapters": [{"id": "g12-eng-u09-c01", "number": "9.1", "title": "9.1 CV Writing, Interview Skills, and Professionalism", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-eng-u10", "number": "10", "title": "Unit 10: Literature and Creative Writing", "order": 10, "review_status": "verified", "chapters": [{"id": "g12-eng-u10-c01", "number": "10.1", "title": "10.1 Poetry, Prose Analysis, and Creative Expression", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        },
        {
            "id": "g12-it",
            "name": "Information Technology",
            "order": 6,
            "review_status": "verified",
            "units": [
                {"id": "g12-it-u01", "number": "1", "title": "Unit 1: Information Systems and Their Applications", "order": 1, "review_status": "verified", "chapters": [{"id": "g12-it-u01-c01", "number": "1.1", "title": "1.1 Ethical, Legal, Social, and Environmental Issues", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-it-u02", "number": "2", "title": "Unit 2: Emerging Technologies", "order": 2, "review_status": "verified", "chapters": [{"id": "g12-it-u02-c01", "number": "2.1", "title": "2.1 Big Data, IoT, Blockchain, and Machine Learning", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-it-u03", "number": "3", "title": "Unit 3: Database Management Systems", "order": 3, "review_status": "verified", "chapters": [{"id": "g12-it-u03-c01", "number": "3.1", "title": "3.1 Advanced SQL, Normalization (1NF, 2NF, 3NF), and Security", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-it-u04", "number": "4", "title": "Unit 4: Web Authoring", "order": 4, "review_status": "verified", "chapters": [{"id": "g12-it-u04-c01", "number": "4.1", "title": "4.1 Responsive Web Design, CSS Frameworks, and JavaScript", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-it-u05", "number": "5", "title": "Unit 5: Maintenance and Troubleshooting", "order": 5, "review_status": "verified", "chapters": [{"id": "g12-it-u05-c01", "number": "5.1", "title": "5.1 Operating System Maintenance and Hardware Repair", "order": 1, "review_status": "verified", "subtopics": []}]},
                {"id": "g12-it-u06", "number": "6", "title": "Unit 6: Fundamentals of Programming", "order": 6, "review_status": "verified", "chapters": [{"id": "g12-it-u06-c01", "number": "6.1", "title": "6.1 Object-Oriented Programming, Modules, and Exception Handling", "order": 1, "review_status": "verified", "subtopics": []}]}
            ]
        }
    ]

    curriculum["curriculum"]["grades"] = [
        {"grade": 9, "subjects": g9_subjects},
        {"grade": 10, "subjects": g10_subjects},
        {"grade": 11, "subjects": g11_subjects},
        {"grade": 12, "subjects": g12_subjects}
    ]

    # Save to curriculum master
    with open('curriculum/ethiopian_curriculum_master.json', 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, indent=2)

    # Save to web app public
    os.makedirs('apps/web/public/data', exist_ok=True)
    with open('apps/web/public/data/curriculum.json', 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, indent=2)

    total_units = 0
    total_chapters = 0
    for g in curriculum["curriculum"]["grades"]:
        for s in g["subjects"]:
            total_units += len(s["units"])
            for u in s["units"]:
                total_chapters += len(u["chapters"])

    print(f"Successfully generated curriculum: {len(curriculum['curriculum']['grades'])} grades, {total_units} units, {total_chapters} chapters.")

if __name__ == '__main__':
    build_complete_ethiopian_curriculum()
