import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Random "mo:core/Random";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  public type ReportStatus = {
    #draft;
    #emailSent;
    #resolved;
    #deleted;
  };

  public type IssueType = {
    #pharmacistAbsent;
    #detailsNotDisplayed;
    #suspectedFake;
    #other : Text;
  };

  public type User = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
  };

  public type Pharmacy = {
    id : Text;
    name : Text;
    address : Text;
    state : Text;
    licenseNumber : Text;
    gpsCoordinates : (Float, Float);
  };

  public type Pharmacist = {
    name : Text;
    registrationNumber : Text;
    state : Text;
    photo : Storage.ExternalBlob;
  };

  public type Observation = {
    timestamp : Time.Time;
    presenceAnswers : [Text];
    photos : [Storage.ExternalBlob];
    gps : (Float, Float);
  };

  public type Report = {
    id : Text;
    owner : Principal;
    user : ?User;
    pharmacy : Pharmacy;
    pharmacist : Pharmacist;
    observation : Observation;
    issues : [IssueType];
    status : ReportStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type Authority = {
    name : Text;
    email : Text;
    phone : Text;
    website : Text;
    jurisdiction : Text;
  };

  public type RegulatoryBody = {
    name : Text;
    bodyType : BodyType;
    state : ?Text;
    description : Text;
    email : Text;
    phone : Text;
    website : Text;
    displayOrder : Nat;
    address : ?Text;
    helpline : ?Text;
  };

  public type BodyType = {
    #national;
    #state;
    #consumer;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
  };

  // State
  let reports = Map.empty<Text, Report>();
  let authorities = Map.empty<Text, [Authority]>();
  let educationContent = Map.empty<Text, Text>();
  let faqContent = Map.empty<Text, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let regulatoryBodies = Map.fromIter<Text, RegulatoryBody>(
    [
      (
        "pci",
        {
          name = "Pharmacy Council of India";
          bodyType = #national;
          state = null;
          description = "Regulates pharmacy education and professional standards under the Pharmacy Act, 1948";
          email = "registrar@pci.nic.in";
          phone = "+91-11-61299900";
          website = "https://www.pci.nic.in";
          displayOrder = 1;
          address = ?("NBCC Centre, 3rd Floor, Plot No. 2, Community Centre, Maa Anandamai Marg, Okhla Phase I, New Delhi – 110020");
          helpline = null;
        },
      ),
      (
        "cdsco",
        {
          name = "Central Drugs Standard Control Organization (CDSCO)";
          bodyType = #national;
          state = null;
          description = "National drug regulatory authority responsible for approval of new drugs, clinical trials, and quality control";
          email = "dci@nic.in";
          phone = "+91-11-23236965";
          website = "https://cdsco.gov.in";
          displayOrder = 2;
          address = ?("FDA Bhawan, Kotla Road, New Delhi – 110002");
          helpline = null;
        },
      ),
      (
        "mohfw",
        {
          name = "Ministry of Health and Family Welfare";
          bodyType = #national;
          state = null;
          description = "Policy-making authority for healthcare and pharmaceutical regulation";
          email = "";
          phone = "+91-11-23061063";
          website = "https://mohfw.gov.in";
          displayOrder = 3;
          address = null;
          helpline = null;
        },
      ),
      (
        "haryana_state_council",
        {
          name = "Haryana State Pharmacy Council";
          bodyType = #state;
          state = ?("Haryana");
          description = "State licensing authority for pharmacists in Haryana";
          email = "registrar.hspc@gmail.com";
          phone = "+91-172-2584125";
          website = "http://hspc.in";
          displayOrder = 4;
          address = ?("Bays No. 35-36, Sector 17-C, Chandigarh");
          helpline = null;
        },
      ),
      (
        "delhi_pharmacy_council",
        {
          name = "Delhi Pharmacy Council";
          bodyType = #state;
          state = ?("Delhi");
          description = "State licensing authority for pharmacists in Delhi";
          email = "";
          phone = "+91-11-22392438";
          website = "https://delhipharmacycouncil.org";
          displayOrder = 5;
          address = null;
          helpline = null;
        },
      ),
      (
        "ncdrc",
        {
          name = "National Consumer Disputes Redressal Commission (NCDRC)";
          bodyType = #consumer;
          state = null;
          description = "Apex consumer court in India";
          email = "";
          phone = "+91-11-24608801";
          website = "https://ncdrc.nic.in";
          displayOrder = 6;
          address = null;
          helpline = null;
        },
      ),
      (
        "consumer_affairs",
        {
          name = "Department of Consumer Affairs";
          bodyType = #consumer;
          state = null;
          description = "Central government department for consumer protection";
          email = "";
          phone = "1915 (Toll Free)";
          website = "https://consumerhelpline.gov.in";
          displayOrder = 7;
          address = null;
          helpline = ?("1915");
        },
      ),
      (
        "ccpa",
        {
          name = "Central Consumer Protection Authority (CCPA)";
          bodyType = #consumer;
          state = null;
          description = "Protects consumer rights and regulates unfair trade practices";
          email = "";
          phone = "";
          website = "https://consumeraffairs.nic.in";
          displayOrder = 8;
          address = null;
          helpline = null;
        },
      ),
    ].values()
  );

  // Custom comparison for sorting reports by date
  module Report {
    public func compareByDate(r1 : Report, r2 : Report) : Order.Order {
      Nat32.compare(Nat32.fromIntWrap(r1.createdAt), Nat32.fromIntWrap(r2.createdAt));
    };
  };

  // Helper functions
  func generateId() : async Text {
    let random = Random.crypto();
    let randomNat64 = await* random.nat64();
    let randomNat32 = Nat32.fromNat(randomNat64.toNat());
    randomNat32.toText();
  };

  // User Profile API
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Report API
  public shared ({ caller }) func createReport(report : Report) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create reports");
    };

    let id = await generateId();
    let newReport : Report = {
      report with
      id;
      owner = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
      status = #draft;
    };
    reports.add(id, newReport);
    id;
  };

  public query ({ caller }) func getReports() : async [Report] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    if (isAdmin) {
      reports.values().toArray().sort(Report.compareByDate);
    } else {
      let userReports = reports.values().filter(func(r : Report) : Bool { r.owner == caller });
      userReports.toArray().sort(Report.compareByDate);
    };
  };

  public query ({ caller }) func getReport(id : Text) : async ?Report {
    switch (reports.get(id)) {
      case (?report) {
        if (report.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?report;
        } else {
          Runtime.trap("Unauthorized: Can only view your own reports");
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateReport(id : Text, updatedReport : Report) : async () {
    switch (reports.get(id)) {
      case (?existingReport) {
        if (existingReport.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own reports");
        };

        let newReport = {
          updatedReport with
          owner = existingReport.owner;
          updatedAt = Time.now();
        };
        reports.add(id, newReport);
      };
      case (null) { Runtime.trap("Report not found") };
    };
  };

  public shared ({ caller }) func updateReportStatus(id : Text, status : ReportStatus) : async () {
    switch (reports.get(id)) {
      case (?report) {
        if (report.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own reports");
        };

        let updatedReport = {
          report with
          status;
          updatedAt = Time.now();
        };
        reports.add(id, updatedReport);
      };
      case (null) { Runtime.trap("Report not found") };
    };
  };

  public shared ({ caller }) func deleteReport(id : Text) : async () {
    switch (reports.get(id)) {
      case (?report) {
        if (report.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own reports");
        };
        reports.remove(id);
      };
      case (null) { Runtime.trap("Report not found") };
    };
  };

  // Authority API - Public read access, admin-only write
  public query ({ caller }) func getAuthoritiesByState(state : Text) : async [Authority] {
    switch (authorities.get(state)) {
      case (?auths) { auths };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addAuthority(state : Text, authority : Authority) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add authorities");
    };

    var updatedAuthorities = List.empty<Authority>();
    switch (authorities.get(state)) {
      case (?auths) {
        let existingAuthorities = List.fromArray<Authority>(auths);
        existingAuthorities.add(authority);
        updatedAuthorities := existingAuthorities;
      };
      case (null) {
        updatedAuthorities.add(authority);
      };
    };
    authorities.add(state, updatedAuthorities.toArray());
  };

  // Education & FAQ API - Public read access, admin-only write
  public query ({ caller }) func getEducationContent(key : Text) : async ?Text {
    educationContent.get(key);
  };

  public query ({ caller }) func getFaq(key : Text) : async ?Text {
    faqContent.get(key);
  };

  public shared ({ caller }) func addEducationContent(key : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add content");
    };
    educationContent.add(key, content);
  };

  public shared ({ caller }) func addFaq(key : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add FAQs");
    };
    faqContent.add(key, content);
  };

  public query ({ caller }) func getAllEducationContent() : async [(Text, Text)] {
    educationContent.toArray();
  };

  public query ({ caller }) func getAllFaq() : async [(Text, Text)] {
    faqContent.toArray();
  };

  // Regulatory Body functions
  public query ({ caller }) func getAllRegulatoryBodies() : async [RegulatoryBody] {
    regulatoryBodies.values().toArray();
  };

  public shared ({ caller }) func addOrUpdateRegulatoryBody(id : Text, body : RegulatoryBody) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add/update regulatory bodies");
    };
    regulatoryBodies.add(id, body);
  };

  public shared ({ caller }) func deleteRegulatoryBody(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete regulatory body");
    };

    switch (regulatoryBodies.get(id)) {
      case (?_rbody) {
        regulatoryBodies.remove(id);
      };
      case (null) { Runtime.trap("Regulatory body not found") };
    };
  };

  public query ({ caller }) func getRegulatoryBody(id : Text) : async ?RegulatoryBody {
    regulatoryBodies.get(id);
  };

  public query ({ caller }) func getRegulatoryBodiesByType(bodyType : BodyType) : async [RegulatoryBody] {
    let filteredBodies = regulatoryBodies.values().filter(
      func(body) {
        body.bodyType == bodyType;
      }
    );
    filteredBodies.toArray();
  };

  public query ({ caller }) func getRegulatoryBodiesByState(state : Text) : async [RegulatoryBody] {
    let filteredBodies = regulatoryBodies.values().filter(
      func(body) {
        switch (body.state, ?state) {
          case (?(bodyState), ?queryState) { bodyState == queryState };
          case (_) { false };
        };
      }
    );
    filteredBodies.toArray();
  };
};
